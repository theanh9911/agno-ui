import { useEffect, useRef, useState, useCallback } from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os'
import { useFetchOSSecurityKey } from '@/api/hooks/queries/os/useFetchOSSecurityKey'
import { toast } from '@/components/ui/toast'
import { useWorkflowsStore } from '@/stores/workflowsStore'

interface WorkflowsWebSocketState {
  connected: boolean
  connecting: boolean
  authenticated: boolean
  error: string | null
  readyState: number
  reconnectAttempts: number
  authAttempts: number
}

interface WebSocketMessage {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  timestamp: number
}

// Convert HTTP/HTTPS endpoint to WebSocket URL with correct path
const getWebSocketUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const protocol = endpoint.startsWith('https://') ? 'wss://' : 'ws://'

  const wsPath = '/workflows/ws'
  const wsUrl = `${protocol}${cleanEndpoint}${wsPath}`

  return wsUrl
}

// Helper to parse SSE-like payloads that look like:
// "event: EventName\n data: { ...json... }"
const parseSSELikeMessage = (
  raw: unknown
): {
  type: string
  data: unknown
} | null => {
  if (typeof raw !== 'string') return null

  // Normalize newlines and check for required prefixes
  const text = String(raw)
  if (!/^event:\s*/.test(text) || text.indexOf('data:') === -1) {
    return null
  }

  const lines = text.split(/\r?\n/)
  let eventName: string | null = null
  const dataLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice('event:'.length).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice('data:'.length).trim())
    }
  }

  const dataText = dataLines.join('\n')
  let parsedData = dataText
  try {
    parsedData = JSON.parse(dataText)
  } catch {
    // Keep as string if not valid JSON
  }

  const type =
    eventName ||
    (typeof parsedData === 'object' &&
      parsedData &&
      (parsedData as { event?: string }).event) ||
    'message'
  return { type, data: parsedData }
}

// Global connection instance to maintain one connection per tab
let globalConnection: WebSocket | null = null
let globalEndpoint: string | null = null
let connectionCount = 0
let reconnectTimeoutRef: ReturnType<typeof setTimeout> | null = null

// Create a simple event emitter for WebSocket events
class WebSocketEventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private listeners = new Map<string, Function[]>()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args))
    }
  }
}

const wsEventEmitter = new WebSocketEventEmitter()

// Global message queue - single source of truth
let globalMessageQueue: WebSocketMessage[] = []

export const useWorkflowsWebSocket = (options?: { autoConnect?: boolean }) => {
  const autoConnect = options?.autoConnect ?? true
  const { currentOS } = useOSStore()
  const { data: isOsAvailable } = useFetchOSStatus()
  const resetAllStreaming = useWorkflowsStore(
    (state) => state.resetAllStreaming
  )

  const { data: securityKeyData } = useFetchOSSecurityKey(currentOS?.id || '')

  const [state, setState] = useState<WorkflowsWebSocketState>({
    connected: false,
    connecting: false,
    authenticated: false,
    error: null,
    readyState: WebSocket.CLOSED,
    reconnectAttempts: 0,
    authAttempts: 0
  })

  // Local state that syncs with global queue via events
  const [messageQueue, setMessageQueue] =
    useState<WebSocketMessage[]>(globalMessageQueue)
  const connectionIdRef = useRef<number>(0)
  const shouldConnect = useRef(false)
  const autoConnectDisabledRef = useRef(false)
  const maxReconnectAttempts = 3
  const maxAuthAttempts = 2

  // Helper to locally update state and broadcast to all subscribers
  const publishConnectionUpdate = useCallback(
    (partial: Partial<WorkflowsWebSocketState>) => {
      setState((prev: WorkflowsWebSocketState) => ({ ...prev, ...partial }))
      wsEventEmitter.emit('connectionUpdate', partial)
    },
    []
  )

  // Authentication function with retry logic
  const authenticate = useCallback(
    (ws: WebSocket, attempt: number = 1) => {
      const securityKey = securityKeyData?.security_keys?.find(
        (key) => key.is_active
      )?.key_value

      if (!securityKey) {
        publishConnectionUpdate({ authenticated: true })
        return
      }
      const authEventData = {
        action: 'authenticate',
        token: securityKey
      }

      try {
        ws.send(JSON.stringify(authEventData))
        publishConnectionUpdate({ authAttempts: attempt })
      } catch {
        //Retrying..
      }
    },
    [securityKeyData, currentOS?.id, publishConnectionUpdate]
  )

  // Listen for queue updates from the global WebSocket
  useEffect(() => {
    const handleQueueUpdate = (newQueue: WebSocketMessage[]) => {
      setMessageQueue([...newQueue])
    }

    wsEventEmitter.on('queueUpdate', handleQueueUpdate)

    // Sync with current global state on mount
    setMessageQueue([...globalMessageQueue])

    return () => {
      wsEventEmitter.off('queueUpdate', handleQueueUpdate)
    }
  }, [])

  // Listen for connection status updates from the global WebSocket
  useEffect(() => {
    const handleConnectionUpdate = (
      partial: Partial<WorkflowsWebSocketState>
    ) => {
      setState((prev: WorkflowsWebSocketState) => ({ ...prev, ...partial }))
    }

    wsEventEmitter.on('connectionUpdate', handleConnectionUpdate)

    return () => {
      wsEventEmitter.off('connectionUpdate', handleConnectionUpdate)
    }
  }, [])

  // Function to consume messages from the queue
  const consumeMessages = useCallback(() => {
    const currentMessages = [...globalMessageQueue]

    // Clear global queue and notify all subscribers
    globalMessageQueue = []
    wsEventEmitter.emit('queueUpdate', globalMessageQueue)
    return currentMessages
  }, [])

  // Check if we should establish connection
  const canConnect = currentOS?.endpoint_url && isOsAvailable
  const wsUrl =
    canConnect && currentOS?.endpoint_url
      ? getWebSocketUrl(currentOS.endpoint_url)
      : null

  // Connect function with auto-reconnection
  const connect = useCallback(() => {
    if (!wsUrl || !canConnect) {
      return
    }

    // Prevent multiple simultaneous connections by checking actual socket state
    if (globalConnection) {
      const currentReadyState = globalConnection.readyState
      if (
        currentReadyState === WebSocket.OPEN ||
        currentReadyState === WebSocket.CONNECTING
      ) {
        // If the endpoint (current os) has changed, close the existing connection to switch to the new OS
        if (globalEndpoint !== wsUrl) {
          try {
            globalConnection.close(1000, 'Switching endpoint after OS change')
          } finally {
            globalConnection = null
            globalEndpoint = null
          }
          // Reset any per-session streaming state and in-flight streaming runs since the connection endpoint changed
          try {
            const store = useWorkflowsStore.getState()
            store.resetAllStreaming()
          } catch {
            // no-op
          }
          // proceed to establish a new connection below
        } else {
          // Same endpoint: just reflect current state and avoid creating a duplicate connection
          publishConnectionUpdate({
            connected: currentReadyState === WebSocket.OPEN,
            connecting: currentReadyState === WebSocket.CONNECTING,
            error: null,
            readyState: currentReadyState
          })
          return
        }
      }
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef) {
      clearTimeout(reconnectTimeoutRef)
      reconnectTimeoutRef = null
    }

    // If we already have a global connection to the same endpoint, reuse it
    if (
      globalConnection &&
      globalEndpoint === wsUrl &&
      globalConnection.readyState === WebSocket.OPEN
    ) {
      publishConnectionUpdate({
        connected: true,
        connecting: false,
        authenticated: false, // Reset authentication status for reused connections
        error: null,
        readyState: globalConnection!.readyState,
        reconnectAttempts: 0,
        authAttempts: 0
      })
      return
    }

    // Close existing connection if it's different or not open
    if (
      globalConnection &&
      (globalEndpoint !== wsUrl ||
        globalConnection.readyState !== WebSocket.OPEN)
    ) {
      globalConnection.close()
      globalConnection = null
      globalEndpoint = null
    }

    publishConnectionUpdate({ connecting: true, error: null })

    try {
      const ws = new WebSocket(wsUrl)
      globalConnection = ws
      globalEndpoint = wsUrl
      connectionCount++
      connectionIdRef.current = connectionCount

      ws.onopen = () => {
        publishConnectionUpdate({
          connected: true,
          connecting: false,
          error: null,
          readyState: ws.readyState,
          reconnectAttempts: 0,
          authAttempts: 0
        })
        // Authenticate with security key if available
        authenticate(ws)
      }

      ws.onmessage = (event) => {
        // Parse message data
        let messageData
        try {
          messageData = JSON.parse(event.data)
        } catch {
          messageData = event.data
        }
        // Handle authentication responses
        if (messageData && typeof messageData === 'object') {
          // Handle auth_required error - only show toast if not in reconnection attempt
          if (messageData.event === 'auth_required' && messageData.error) {
            const currentAttempt = state.authAttempts || 1
            const isReconnecting = state.reconnectAttempts > 0

            if (currentAttempt < maxAuthAttempts) {
              if (!isReconnecting) {
                toast.error({
                  title: 'Authentication Retry',
                  description:
                    'Security key authentication failed, trying again...',
                  id: 'auth-retry'
                })
              }
              setTimeout(() => authenticate(ws, currentAttempt + 1), 1000)
            } else {
              if (!isReconnecting) {
                toast.error({
                  title: 'Authentication Failed',
                  description:
                    'Authentication failed after 2 attempts. Please check your security key configuration in AgentOS.'
                })
              }
              publishConnectionUpdate({
                connected: false,
                error:
                  'Authentication failed. Check your security key configuration.',
                authAttempts: currentAttempt + 1
              })
            }
            return
          }
          if (messageData.event === 'auth_error') {
            // Dismiss any existing auth toasts before showing final error
            toast.dismiss('auth-retry')
            toast.error({
              title: 'Authentication Error',
              description: messageData.error.error
                ? messageData.error.error
                : 'Authentication failed. Please check your security key configuration in AgentOS.'
            })
            publishConnectionUpdate({
              connected: false,
              error:
                'Authentication failed. Please check your security key configuration.'
            })
          }

          // Handle successful authentication
          if (
            messageData.event === 'authenticated' ||
            (messageData.action === 'authenticate' &&
              messageData.status === 'success')
          ) {
            publishConnectionUpdate({ authenticated: true })
          }
        }

        const sseParsed = parseSSELikeMessage(event.data)
        const message: WebSocketMessage = {
          type: (sseParsed && sseParsed.type) || 'message',
          data: sseParsed ? sseParsed.data : event.data,
          timestamp: Date.now()
        }
        globalMessageQueue = [...globalMessageQueue, message]
        wsEventEmitter.emit('queueUpdate', globalMessageQueue)
      }

      ws.onerror = () => {
        publishConnectionUpdate({
          connecting: false,
          error: 'WebSocket connection failed'
        })
      }

      ws.onclose = (event) => {
        publishConnectionUpdate({
          connected: false,
          connecting: false,
          authenticated: false,
          readyState: ws.readyState,
          authAttempts: 0
        })

        // Clear stale per-session streaming flags and runs on socket close
        resetAllStreaming()

        // Clear global connection if it's the same instance
        if (globalConnection === ws) {
          globalConnection = null
          globalEndpoint = null
        }

        // If this was a normal closure (intentional disconnect), do not treat as an error
        if (event.code === 1000) {
          return
        }

        // Auto-reconnect with exponential backoff if not intentional disconnect
        if (canConnect && state.reconnectAttempts < maxReconnectAttempts) {
          const nextAttempt = state.reconnectAttempts + 1
          const delay = Math.min(1000 * Math.pow(2, nextAttempt), 10000) // Max 10 seconds

          publishConnectionUpdate({ reconnectAttempts: nextAttempt })

          reconnectTimeoutRef = setTimeout(() => {
            if (canConnect && state.reconnectAttempts < maxReconnectAttempts) {
              connect()
            }
          }, delay)
        } else if (state.reconnectAttempts >= maxReconnectAttempts) {
          autoConnectDisabledRef.current = true
          publishConnectionUpdate({
            error: `Failed to connect to WebSocket after ${maxReconnectAttempts} attempts. Check if server is running on port 7777 with /workflows/ws endpoint.`
          })
        } else {
          publishConnectionUpdate({
            error: `WebSocket connection failed (Code: ${event.code})`
          })
          toast.error({
            description: 'Connection failed. Workflow execution stopped.'
          })
        }
      }
    } catch {
      publishConnectionUpdate({
        connecting: false,
        error: 'Failed to create WebSocket connection'
      })
      toast.error({
        description: 'Connection failed. Workflow execution stopped.'
      })
    }
  }, [
    wsUrl,
    canConnect,
    currentOS?.endpoint_url,
    isOsAvailable,
    authenticate,
    publishConnectionUpdate
  ])

  // Disconnect function
  const disconnect = useCallback(() => {
    // Clear reconnect timeout
    if (reconnectTimeoutRef) {
      clearTimeout(reconnectTimeoutRef)
      reconnectTimeoutRef = null
    }

    if (globalConnection) {
      globalConnection.close(1000, 'Intentional disconnect')
      globalConnection = null
      globalEndpoint = null
    }
    // Also reset streaming state when manually disconnecting
    resetAllStreaming()

    publishConnectionUpdate({
      connected: false,
      connecting: false,
      authenticated: false,
      error: null,
      readyState: WebSocket.CLOSED,
      reconnectAttempts: 0,
      authAttempts: 0
    })
  }, [])

  // Manual reconnect function: force reset and connect again
  const reconnect = useCallback(() => {
    // If there's already a live or connecting socket, reflect state and avoid tearing it down
    if (globalConnection) {
      const currentReadyState = globalConnection.readyState
      if (
        currentReadyState === WebSocket.OPEN ||
        currentReadyState === WebSocket.CONNECTING
      ) {
        publishConnectionUpdate({
          connected: currentReadyState === WebSocket.OPEN,
          connecting: currentReadyState === WebSocket.CONNECTING,
          error: null,
          readyState: currentReadyState
        })
        return
      }
    }
    // Clear any pending reconnect timers and close existing connection
    autoConnectDisabledRef.current = false
    disconnect()
    // Reset attempts and errors, then try connecting again shortly after
    publishConnectionUpdate({
      reconnectAttempts: 0,
      authAttempts: 0,
      error: null,
      connecting: false,
      connected: false,
      readyState: WebSocket.CLOSED
    })
    setTimeout(() => {
      connect()
    }, 0)
  }, [disconnect, connect, publishConnectionUpdate])

  // Send message function
  const sendMessage = useCallback((message: unknown) => {
    if (globalConnection && globalConnection.readyState === WebSocket.OPEN) {
      const dataToSend =
        typeof message === 'string' ? message : JSON.stringify(message)
      globalConnection.send(dataToSend)
      return true
    }

    return false
  }, [])

  // Effect to handle connection based on AgentOS availability
  useEffect(() => {
    if (!autoConnect) {
      return
    }
    if (autoConnectDisabledRef.current) {
      return
    }
    shouldConnect.current = !!canConnect

    if (canConnect) {
      // Only connect if we're not already connected or connecting
      if (!state.connected && !state.connecting) {
        connect()
      }
    } else {
      if (state.connected || state.connecting) {
        disconnect()
      }
    }

    // Cleanup on unmount
    return () => {
      if (!shouldConnect.current) {
        disconnect()
      }
    }
  }, [wsUrl, currentOS?.endpoint_url, isOsAvailable, autoConnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef) {
        clearTimeout(reconnectTimeoutRef)
        reconnectTimeoutRef = null
      }
    }
  }, [])

  // Mute controls: store muted session/run identifiers locally (per hook consumer)
  const mutedSessionsRef = useRef<Set<string>>(new Set())
  const mutedRunsRef = useRef<Set<string>>(new Set())

  const muteSession = useCallback((sessionId: string) => {
    if (sessionId) mutedSessionsRef.current.add(sessionId)
  }, [])

  const unmuteSession = useCallback((sessionId: string) => {
    if (sessionId) mutedSessionsRef.current.delete(sessionId)
  }, [])

  const muteRun = useCallback((runId: string) => {
    if (runId) mutedRunsRef.current.add(runId)
  }, [])

  const unmuteRun = useCallback((runId: string) => {
    if (runId) mutedRunsRef.current.delete(runId)
  }, [])

  return {
    ...state,
    messageQueue, // Expose the message queue
    consumeMessages, // Expose the function to consume messages
    connect,
    disconnect,
    reconnect,
    sendMessage,
    isOsAvailable,
    endpoint: currentOS?.endpoint_url || null,
    websocketUrl: wsUrl,
    // expose mute controls
    muteSession,
    unmuteSession,
    muteRun,
    unmuteRun,
    // expose for consumers to check if muted
    _isSessionMuted: (id: string) => mutedSessionsRef.current.has(id),
    _isRunMuted: (id: string) => mutedRunsRef.current.has(id)
  }
}

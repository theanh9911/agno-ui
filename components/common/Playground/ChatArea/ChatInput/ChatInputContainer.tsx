import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { TextArea } from './TextArea'
import FileUpload from './FileUpload'
import WorkflowRunButton from '@/components/pages/WorkflowsPage/MainPage/FormComponents/WorkflowRunButton'
import { WorkflowDetails } from '@/types/workflow'
import { useWorkflowsWebSocket } from '@/hooks/workflows/useWorkflowsWebSocket'
import { useWorkflowCancelRun } from '@/hooks/playground/useCancelRun'
import SelectComponentType from './SelectComponentType'
import { useUploadFileStore } from '@/stores/playground'
import InputSchemaForm from '../../InputSchemaForm'
import { AgentDetails } from '@/types/os'
import { TeamDetails } from '@/types/os'
import { usePageViewOptions, PageViewState } from '@/hooks/os'

type WorkflowButtonState = 'idle' | 'loading' | 'streaming'

const getWorkflowButtonState = (
  view: PageViewState,
  connected: boolean,
  isStreaming: boolean
): WorkflowButtonState => {
  switch (view) {
    case PageViewState.DISCONNECTED:
    case PageViewState.INACTIVE:
      return 'idle'
    case PageViewState.LOADING:
      return 'loading'
    case PageViewState.CONTENT:
      if (isStreaming) return 'streaming'
      if (!connected) return 'loading'
      return 'idle'
    default:
      return 'idle'
  }
}

interface ChatInputContainerProps {
  // Workflow props
  isWorkflow: boolean
  selectedId: string | undefined
  formData: unknown
  inputSchema: unknown
  isFormValid: boolean

  // Input props
  inputMessage: string
  setInputMessage: (message: string) => void
  chatInputRef: React.RefObject<HTMLTextAreaElement | null>
  isDisabled: boolean
  data: AgentDetails[] | TeamDetails[] | WorkflowDetails[]

  // Streaming state
  isStreaming: boolean
  session?: string

  // Handlers
  onSubmit: (data?: unknown) => void
}

const ChatInputContainer = ({
  isWorkflow,
  selectedId,
  formData,
  inputSchema,
  isFormValid,
  inputMessage,
  setInputMessage,
  chatInputRef,
  isDisabled,
  data,
  isStreaming,
  session,
  onSubmit
}: ChatInputContainerProps) => {
  const { connected } = useWorkflowsWebSocket()
  const { cancelRuns } = useWorkflowCancelRun()
  const { files } = useUploadFileStore()
  const { view } = usePageViewOptions()
  // Follow-up button state
  const [showFollowUpButton, setShowFollowUpButton] = useState(false)
  const [streamingStarted, setStreamingStarted] = useState(false)
  const [previousSession, setPreviousSession] = useState<string | undefined>(
    session
  )
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hasSchema = Boolean(inputSchema)

  // Listen for Enter key events from workflow form fields
  useEffect(() => {
    const handleWorkflowEnterKey = () => {
      if (isWorkflow) {
        handleWorkflowSubmit()
      }
    }

    document.addEventListener('workflow-enter-key', handleWorkflowEnterKey)
    return () => {
      document.removeEventListener('workflow-enter-key', handleWorkflowEnterKey)
    }
  }, [isWorkflow])

  // Handle session changes - show full chat input when session changes and no session ID
  useEffect(() => {
    if (previousSession !== session) {
      setPreviousSession(session)
      if (!session) {
        setShowFollowUpButton(false)
      }
    }
  }, [session, previousSession])

  // Show follow-up button immediately after sending message
  useEffect(() => {
    if (isStreaming && !streamingStarted) {
      setStreamingStarted(true)
      setShowFollowUpButton(true) // Show immediately after message is sent
    } else if (!isStreaming && streamingStarted) {
      setStreamingStarted(false)
    }
  }, [isStreaming, streamingStarted])

  // Listen for non-workflow selection change to show follow-up immediately
  useEffect(() => {
    const handleShowFollowUp = () => {
      if (!isWorkflow) {
        setShowFollowUpButton(true)
      }
    }
    document.addEventListener('show-follow-up', handleShowFollowUp)
    return () => {
      document.removeEventListener('show-follow-up', handleShowFollowUp)
    }
  }, [isWorkflow])

  // Click outside handler: for workflows with schema, show follow-up on outside click
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!hasSchema) return
      const target = event.target as Element
      if (!containerRef.current) return

      if (!containerRef.current.contains(target)) {
        const isInChatContent = target.closest('.chat-content-area')

        if (isInChatContent) {
          setShowFollowUpButton(true)
        }
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [hasSchema])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (files.length > 0 && showFollowUpButton) {
      setShowFollowUpButton(false)
      chatInputRef.current?.focus()
    }
  }, [files.length, isWorkflow])

  // Determine what to show based on conditions
  const shouldShowFollowUpButton = showFollowUpButton

  // Submit handler for agent/team message path
  const handleMessageSubmit = async () => {
    setShowFollowUpButton(false)
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
    }
    // Ensure input is cleared immediately in follow-up state
    setInputMessage('')
    await onSubmit()
  }

  // Submit handler for workflow path
  const handleWorkflowSubmit = async () => {
    if (isStreaming) return
    // Validate form when workflow has a schema
    if (isWorkflow && inputSchema && !isFormValid) {
      // Trigger form validation in the form component to reveal field errors
      document.dispatchEvent(new Event('workflow-validate'))
      return
    }
    // For schema workflows, show follow-up immediately
    if (isWorkflow && inputSchema) {
      setShowFollowUpButton(true)
    } else {
      setShowFollowUpButton(false)
    }

    // Clear any existing timeout
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
    }

    // Execute using provided handler
    if (isWorkflow) {
      setInputMessage('')
      await onSubmit(formData)
    } else {
      setInputMessage('')
      await handleMessageSubmit()
    }
  }

  const runButtonDisabled = hasSchema ? !isFormValid || isDisabled : isDisabled

  const workflowRunButtonDisabled =
    !connected || !selectedId || (hasSchema && !isStreaming && !isFormValid)

  // Click handler for the workflow button: stop if streaming, otherwise run
  const handleWorkflowButtonClick = async () => {
    if (isStreaming) {
      await cancelRuns()
    } else {
      await handleWorkflowSubmit()
    }
  }

  // Follow-up button click handler
  const handleFollowUpClick = () => {
    setShowFollowUpButton(false)
    setTimeout(() => chatInputRef.current?.focus(), 0)
  }

  return (
    <motion.div
      ref={containerRef}
      id="chat-input-container"
      className={`mx-auto my-auto mb-2 flex w-full max-w-[800px] flex-col items-center gap-2 rounded-xl border border-border bg-accent p-2 shadow-md`}
    >
      {!shouldShowFollowUpButton && !hasSchema && !isWorkflow && (
        <FileUpload
          showBanner
          showTrigger={false}
          className="w-full max-w-[800px] bg-transparent p-0"
        />
      )}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {hasSchema && !shouldShowFollowUpButton ? (
            /* Show workflow form */
            <motion.div
              key="workflow-form"
              initial={false}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 0.25, ease: 'easeIn' }
              }}
            >
              <InputSchemaForm
                onRun={handleWorkflowSubmit}
                inputSchema={(inputSchema as unknown) || undefined}
                inputMessage={inputMessage}
              />
            </motion.div>
          ) : (
            /* Show regular textarea */
            <motion.div
              key="text-area"
              initial={false}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              exit={{
                opacity: 0,
                height: 48,
                transition: { duration: 0.2, ease: 'easeIn' }
              }}
            >
              <TextArea
                placeholder={isStreaming ? 'Running...' : 'Ask anything...'}
                value={!inputSchema ? inputMessage : undefined}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.nativeEvent.isComposing &&
                    !e.shiftKey &&
                    !isDisabled
                  ) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isWorkflow) {
                      handleWorkflowSubmit()
                    } else {
                      handleMessageSubmit()
                    }
                  }
                }}
                onClick={handleFollowUpClick}
                className="rounded-lg border border-none bg-secondary p-3 placeholder-muted/50"
                disabled={data.length === 0}
                ref={chatInputRef}
                overlay={
                  shouldShowFollowUpButton && (
                    <div className="flex items-center">
                      {isWorkflow ? (
                        <WorkflowRunButton
                          onRun={handleWorkflowButtonClick}
                          disabled={workflowRunButtonDisabled}
                          state={getWorkflowButtonState(
                            view,
                            connected,
                            isStreaming
                          )}
                          compact
                        />
                      ) : (
                        <Button
                          onClick={handleMessageSubmit}
                          disabled={runButtonDisabled}
                          variant="default"
                          icon="arrow-up-from-dot"
                          size="iconXs"
                          className="size-6 shrink-0 rounded-sm"
                        />
                      )}
                    </div>
                  )
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom row with animation */}
      <AnimatePresence initial={false}>
        {!shouldShowFollowUpButton && (
          <motion.div
            className={`flex w-full ${isWorkflow || hasSchema ? 'justify-end' : 'justify-between'} gap-2`}
            initial={false}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
              scale: 0.95,
              transition: {
                duration: 0.25,
                ease: 'easeInOut'
              }
            }}
            animate={{
              opacity: 1,
              height: 'auto',

              scale: 1,
              transition: {
                duration: 0.2,
                ease: [0.23, 1, 0.32, 1] // Custom easing for smooth entry
              }
            }}
          >
            {!isWorkflow && !hasSchema && (
              <FileUpload showBanner={false} showTrigger />
            )}
            <div className="flex items-center gap-2">
              <SelectComponentType />
              {isWorkflow ? (
                <WorkflowRunButton
                  onRun={handleWorkflowButtonClick}
                  disabled={workflowRunButtonDisabled}
                  state={getWorkflowButtonState(view, connected, isStreaming)}
                />
              ) : (
                <Button
                  onClick={handleMessageSubmit}
                  disabled={runButtonDisabled}
                  variant="default"
                  icon="arrow-up-from-dot"
                  size="iconXs"
                  className="size-8 shrink-0 rounded-sm"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ChatInputContainer

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/components/ui/toast'

interface NetworkStatusContextType {
  isOnline: boolean
}

const NetworkStatusContext = createContext<
  NetworkStatusContextType | undefined
>(undefined)

export const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext)
  if (context === undefined) {
    throw new Error(
      'useNetworkStatus must be used within a NetworkStatusProvider'
    )
  }
  return context
}

interface NetworkStatusProviderProps {
  children: React.ReactNode
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({
  children
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success({
        title: 'Connected',
        description: "You're back online!",
        id: 'network-status-online',
        duration: 3000
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error({
        title: 'No Connection',
        description: "You're offline. Please check your internet connection.",
        id: 'network-status-offline',
        duration: 0 // Don't auto-dismiss offline toast
      })
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const value = {
    isOnline
  }

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  )
}

import { ReactNode, useEffect, useRef } from 'react'

import { useOSStore } from '@/stores/OSStore'
import { useManualStore } from '@/stores/ManualStore'

interface ManualModeProviderProps {
  children: ReactNode
}

/**
 * Đảm bảo state manual mode được reset khi chuyển AgentOS.
 * Có thể mở rộng để lắng nghe WebSocket hoặc push cập nhật sau này.
 */
export const ManualModeProvider = ({ children }: ManualModeProviderProps) => {
  const currentOSId = useOSStore((state) => state.currentOS?.id || null)
  const resetAll = useManualStore((state) => state.resetAll)
  const previousOSIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (
      previousOSIdRef.current !== null &&
      previousOSIdRef.current !== currentOSId
    ) {
      resetAll()
    }
    previousOSIdRef.current = currentOSId
  }, [currentOSId, resetAll])

  return <>{children}</>
}

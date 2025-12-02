import { useEffect, useRef } from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useRouteState } from '@/hooks/useRouteState'

/**
 * Hook that resets the current page to default state whenever the OS changes
 */
export const useOSChangeReset = () => {
  const currentOS = useOSStore((state) => state.currentOS)
  const { resetCurrentPageToDefault, currentPageName } = useRouteState()
  const previousOSIdRef = useRef<string | null>(null)

  useEffect(() => {
    const currentOSId = currentOS?.id || null

    // Skip on initial mount (when previousOSIdRef is null and currentOSId is also null)
    // Only reset if OS actually changed
    if (
      previousOSIdRef.current !== null &&
      previousOSIdRef.current !== currentOSId &&
      currentPageName
    ) {
      // Reset to default state
      resetCurrentPageToDefault()
    }

    // Update the ref for next comparison
    previousOSIdRef.current = currentOSId
  }, [currentOS?.id, currentPageName, resetCurrentPageToDefault])
}

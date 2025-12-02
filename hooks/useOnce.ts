import { useEffect, useRef } from 'react'

/**
 * Used to only run a function once after the parent component first renders
 */
const useOnce = (
  callback: () => void,
  cleanup?: () => void,
  condition?: boolean
) => {
  const hasRun = useRef(false)

  useEffect(() => {
    const hasPassedCondition = condition === undefined || condition === true

    if (hasRun.current === false && hasPassedCondition) {
      hasRun.current = true
      callback()
    }

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [callback, cleanup, condition])
}

export default useOnce

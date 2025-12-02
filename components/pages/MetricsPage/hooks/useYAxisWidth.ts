import { useCallback, useEffect, useRef, useState } from 'react'
import { constrainWidth } from '../utils'

interface UseYAxisWidthOptions {
  yAxisMargin?: number
  maxYAxisWidth?: number
}
type Col = {
  name: string
  [key: string]: number | string
}
export const useYAxisWidth = (data: Col[], options?: UseYAxisWidthOptions) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [yAxisWidth, setYAxisWidth] = useState<number | undefined>(45)
  const yAxisMargin = options?.yAxisMargin ?? 10
  const maxYAxisWidth = options?.maxYAxisWidth ?? 60

  const getYAxisWidth = useCallback((): number | undefined => {
    if (!containerRef.current) return undefined
    const yAxisElement = containerRef.current.querySelector(
      '.yAxis .recharts-cartesian-axis-ticks'
    )
    const width = yAxisElement?.getBoundingClientRect().width
    if (!width) return undefined

    return constrainWidth(width, yAxisMargin, maxYAxisWidth)
  }, [yAxisMargin, maxYAxisWidth])

  useEffect(() => {
    const updateYAxisWidth = () => {
      const width = getYAxisWidth()
      if (width) {
        setYAxisWidth(width)
      }
    }

    const animationFrameId = requestAnimationFrame(updateYAxisWidth)

    return () => cancelAnimationFrame(animationFrameId)
  }, [data, getYAxisWidth])

  return { containerRef, yAxisWidth }
}

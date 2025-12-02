import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { useFilterType } from '@/hooks/useFilterType'

const MessageAreaWrapper = ({
  children,
  runsLength,
  isStreaming
}: {
  children?: ReactNode
  runsLength: number
  isStreaming: boolean
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [previousConversationLength, setPreviousConversationLength] =
    useState(0)
  const { isWorkflow } = useFilterType()

  // Scroll to bottom on initial mount
  useEffect(() => {
    if (runsLength > 0 && isInitialLoad && scrollContainerRef.current) {
      // Wait for DOM to render, then scroll to absolute bottom
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'auto'
          })
          setIsInitialLoad(false)
          setPreviousConversationLength(runsLength)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [runsLength, isWorkflow, isInitialLoad])

  // Handle scrolling ONLY for new messages (when conversation length increases)
  useEffect(() => {
    const currentLength = runsLength

    // Only trigger when:
    // 1. Not initial load
    // 2. Length actually increased (new message added)
    // 3. Currently streaming (actively adding content)
    if (
      !isInitialLoad &&
      currentLength > previousConversationLength &&
      isStreaming
    ) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 50)
      return () => clearTimeout(timer)
    }

    // Update previous length for next comparison
    if (!isInitialLoad) {
      setPreviousConversationLength(currentLength)
    }
  }, [
    isWorkflow,
    isInitialLoad,
    previousConversationLength,
    isStreaming,
    runsLength
  ])

  return (
    <div className="relative h-full w-full flex-grow">
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto"
      >
        <div className={cn('mx-auto w-full max-w-[800px] px-6 pt-[72px]')}>
          <div className="min-h-full pb-44">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default MessageAreaWrapper

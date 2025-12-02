import { useRef } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'

import useOnce from '@/hooks/useOnce'
import { cn } from '@/utils/cn'

import Run from './Run'
import SkeletonList from '@/components/common/Playground/SkeletonList'
import { RunResponseContent } from '@/types/Agent'

interface RunsTabProps {
  runs?: RunResponseContent[] | null
  isLoading: boolean
  isTeam: boolean
  isWorkflow: boolean
}

const RunsTab: React.FC<RunsTabProps> = ({
  runs,
  isLoading,
  isTeam,
  isWorkflow
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const rowVirtualizer = useVirtualizer({
    count: runs?.length ?? 5,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 5
  })

  useOnce(() => {
    rowVirtualizer.measure()
  })
  const virtualItems = rowVirtualizer.getVirtualItems()

  if (isLoading) {
    return <SkeletonList skeletonCount={4} />
  }

  return (
    <div ref={parentRef} className={cn('relative flex size-full flex-col')}>
      <div
        className="relative flex"
        style={{
          height: rowVirtualizer.getTotalSize()
        }}
      >
        {virtualItems.map((virtualItem) => {
          const event = runs?.[virtualItem.index]
          if (!event) return null
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full pb-1 last-of-type:pb-1"
              style={{
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <Run
                key={virtualItem.key}
                run={event}
                index={virtualItem.index}
                isTeam={isTeam}
                isWorkflow={isWorkflow}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RunsTab

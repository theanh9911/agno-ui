import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { formatSessionNameForDisplay } from '@/utils/sessionName'
import React from 'react'

interface RunListProps<T> {
  items: T[]
  activeRunId?: string | null
  onRunClick?: () => void
  activeRunRef?: React.RefObject<HTMLAnchorElement | null>
  getRunId: (item: T) => string
  getLabel: (item: T) => string
}

const RunList = <T,>({
  items,
  activeRunId,
  onRunClick,
  activeRunRef,
  getRunId,
  getLabel
}: RunListProps<T>) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const runId = getRunId(item)
          const isActive = activeRunId === runId
          return (
            <a
              key={runId}
              ref={isActive ? activeRunRef : null}
              href={`#conversation-${runId}`}
              className={`flex h-[29px] w-full cursor-pointer items-center gap-2 truncate border-l pl-2 ${isActive ? 'border-brand' : 'border-primary'}`}
              onClick={onRunClick}
            >
              <Paragraph
                size="body"
                className={cn(
                  'truncate',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              >
                {formatSessionNameForDisplay(getLabel(item))}
              </Paragraph>
            </a>
          )
        })}
      </div>
    </>
  )
}

export default RunList

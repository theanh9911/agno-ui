import React from 'react'
import StreamingLoader from './StreamingLoader'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'

const IntermediateStepsTrigger = ({
  label,
  isOpen,
  isStreaming
}: {
  label: string
  isOpen: boolean
  isStreaming: boolean
}) => {
  return (
    <div className="flex w-full items-center gap-2 truncate">
      {isStreaming && <StreamingLoader />}
      <Paragraph size="body" className="truncate text-muted">
        {label}
      </Paragraph>
      <Icon
        type="chevron-down"
        size={16}
        className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </div>
  )
}

export default IntermediateStepsTrigger

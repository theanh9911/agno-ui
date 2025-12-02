import React from 'react'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { FormatType } from '@/components/pages/SessionsPage/types'
import { SessionContentProps } from './types'

interface RunContentProps extends SessionContentProps {
  viewMode: FormatType
}

const RunContent = ({
  icon,
  role,
  response,
  time,
  viewMode
}: RunContentProps) => (
  <div className="flex w-full flex-col gap-y-2.5">
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center gap-x-4">
        {icon && <Icon type={icon} className="shrink-0" />}
        {role && (
          <div className="flex w-full items-center justify-between">
            <Paragraph size="mono" className="uppercase text-muted">
              {role}
            </Paragraph>
          </div>
        )}
      </div>
      <div className="flex w-[calc(25%-15px+3rem)] items-center justify-end gap-1 text-muted">
        {time && (
          <Paragraph size="mono" className="font-normal text-muted/50">
            {time}
          </Paragraph>
        )}
      </div>
    </div>
    <div
      className={cn(
        viewMode === FormatType.Formatted
          ? 'text-primary/80'
          : 'text-primary/100',
        'flex flex-col gap-y-4',
        icon || role ? 'pl-10' : ''
      )}
    >
      {response}
    </div>
  </div>
)

export default RunContent

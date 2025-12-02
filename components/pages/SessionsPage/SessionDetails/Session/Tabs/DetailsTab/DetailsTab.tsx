import React from 'react'

import CopyButton from '@/components/common/CopyButton'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'

import { getSessionDetailsTabData } from '@/components/pages/SessionsPage/constant'
import { Skeleton } from '@/components/ui/skeleton'
import { AgentSessionDataWithTeamAndWorkflow } from '@/types/Agent'

interface DetailsTabProps {
  isLoading: boolean
  data: AgentSessionDataWithTeamAndWorkflow | null | undefined
  isTeam?: boolean
  isWorkflow?: boolean
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  isLoading,
  data,
  isTeam,
  isWorkflow
}) => {
  const details = data ? getSessionDetailsTabData(data, isTeam, isWorkflow) : []

  if (isLoading) {
    return <Skeleton className="h-full w-full animate-pulse" />
  }

  return (
    <div className="flex w-full flex-col gap-y-4 rounded-md bg-secondary/50 p-3">
      <div className="flex flex-col gap-4 rounded-md">
        {details?.map((metric) => (
          <div key={metric?.title} className="flex w-full items-center">
            <div className="w-[30%]">
              <Paragraph size="mono" className="uppercase text-muted">
                {metric.title}
              </Paragraph>
            </div>
            <div className="flex items-center justify-start gap-1">
              {metric.icon && (
                <Icon
                  type={metric?.icon}
                  size={
                    metric?.icon !== 'avatar' &&
                    metric?.icon !== 'team-orange-bg'
                      ? 'xs'
                      : 'sm'
                  }
                  className={cn(
                    metric.icon !== 'avatar' && 'text-muted/50',
                    'inline-block'
                  )}
                />
              )}
              <Paragraph
                size="body"
                className="w-full whitespace-nowrap text-left"
              >
                {metric?.value}
              </Paragraph>
              {metric.copyButton && metric.value && (
                <CopyButton content={metric.value.toString()} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetailsTab

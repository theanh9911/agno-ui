import { BlankState } from '@/components/common/BlankState'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Paragraph from '@/components/ui/typography/Paragraph'
import { SessionSummary } from '@/types/Agent'
import { formatDate } from '@/utils/format'
import React from 'react'
import { DOC_LINKS } from '@/docs'

interface SummaryTabProps {
  isLoading: boolean
  session_summary?: SessionSummary
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  isLoading,
  session_summary
}) => {
  const isSummaryAvailable = session_summary && session_summary.summary
  const summary = session_summary?.summary || ''
  const topics = session_summary?.topics || []
  const lastUpdated = session_summary?.updated_at || ''
  if (isLoading) {
    return <Skeleton className="h-full w-full animate-pulse" />
  }

  if (!isSummaryAvailable) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BlankState
          visual="agent-blank-state-visual"
          title="No summary available"
          docLink={DOC_LINKS.platform.agents.memory}
          description="To enable session summaries, set enable_session_summaries=True on the Agent"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between uppercase text-muted">
        <Paragraph size="label">SUMMARY</Paragraph>
        <Paragraph size="label">
          LAST UPDATED: {formatDate(lastUpdated, 'date-first-natural')} AT{' '}
          {formatDate(lastUpdated, 'time-for-chat')}
        </Paragraph>
      </div>
      <Paragraph size="lead" className="text-primary/80">
        {summary}
      </Paragraph>
      <div className="flex w-full flex-wrap gap-2">
        {topics.length > 0 &&
          topics.map((topic, index) => (
            <Badge
              key={index}
              className="uppercase text-primary"
              variant="outline"
            >
              {topic}
            </Badge>
          ))}
      </div>
    </div>
  )
}

export default SummaryTab

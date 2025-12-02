import { useSessionStore } from '@/stores/SessionsStore'

import { cn } from '@/utils/cn'

import DetailsTab from './Tabs/DetailsTab'

import NoLoggedSession from '../../BlankState/NotLoggedSession'
import RunsTab from './Tabs/RunsTab'
import { useRunsQuery, useSessionByIdQuery } from '@/hooks/sessions'
import SummaryTab from './Tabs/SummaryTab'
import { Tab } from '../../types'
import MetricsTab from './Tabs/MetricsTab'
import SkeletonList from '@/components/common/Playground/SkeletonList'
import { useFilterType } from '../../../../../hooks/useFilterType'

const Session = () => {
  const currentTab = useSessionStore((state) => state.currentTab)
  const { data: runs, isLoading } = useRunsQuery()
  const { data, isLoading: isSessionLoading } = useSessionByIdQuery()
  const { isTeam, isWorkflow } = useFilterType()
  const renderTabContent = () => {
    switch (currentTab) {
      case Tab.Run:
        return (
          <RunsTab
            isLoading={isLoading}
            runs={runs}
            isTeam={isTeam}
            isWorkflow={isWorkflow}
          />
        )
      case Tab.Summary:
        return (
          <SummaryTab
            isLoading={isSessionLoading}
            session_summary={data?.session_summary}
          />
        )
      case Tab.Metrics:
        return (
          <MetricsTab
            isLoading={isSessionLoading}
            metrics={
              isWorkflow ? data?.session_data?.session_metrics : data?.metrics
            }
          />
        )
      case Tab.Details:
        return (
          <DetailsTab
            isLoading={isSessionLoading}
            data={data}
            isTeam={isTeam}
            isWorkflow={isWorkflow}
          />
        )

      // case Tab.Team:
      //   return <div className="min-h-full">{teamsTab}</div>
      default:
        return null
    }
  }

  const content = isLoading ? (
    <SkeletonList skeletonCount={4} />
  ) : runs && runs?.length > 0 ? (
    renderTabContent()
  ) : (
    <div className="mx-4 w-full">
      <NoLoggedSession runs />
    </div>
  )

  return (
    <div className={cn('size-full flex-1 overflow-y-auto px-6 py-4')}>
      {content}
    </div>
  )
}

export default Session

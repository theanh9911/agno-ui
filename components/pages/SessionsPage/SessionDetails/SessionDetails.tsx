import { type FC, useMemo } from 'react'
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import SessionTabs from './SessionTabs'
import { type SessionDetails, type SessionDetailsProps } from '../types'
import NoSessionSelected from '../BlankState/NoSessionSelected'
import Icon from '@/components/ui/icon'
import { useParams } from '@/utils/navigation'
import { type DefaultPageParams } from '@/types/globals'
import RunsTabHeader from './Session/Tabs/RunsTab/RunsTabHeader'
import { useSessionStore } from '@/stores/SessionsStore'
import Session from './Session'
import { formatDate } from '@/utils/format'
import { useFilterType } from '../../../../hooks/useFilterType'
import { formatSessionNameForDisplay } from '@/utils/sessionName'

const SessionDetails: FC<SessionDetailsProps> = ({
  noSelectedPage = false
}) => {
  const params = useParams<DefaultPageParams>() || {}

  const currentSession = useSessionStore((state) => state.currentSession)
  const { isTeam, isWorkflow } = useFilterType()
  const displayName = useMemo(
    () =>
      currentSession?.session_name
        ? formatSessionNameForDisplay(currentSession.session_name)
        : '-',
    [currentSession?.session_name]
  )

  const renderIcon = () => {
    return isTeam ? (
      <Icon type="team-orange-bg" size={36} className="text-brand" />
    ) : isWorkflow ? (
      <Icon type="workflow-with-orange-bg" size={36} className="text-brand" />
    ) : (
      <Icon type="avatar" size={36} />
    )
  }

  if (!params.id && noSelectedPage) {
    return (
      <div className="mx-auto h-full w-full select-none">
        <NoSessionSelected />
      </div>
    )
  }
  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-[10px]">
      <div className="sticky top-0 z-10 mx-6 flex flex-shrink-0 flex-col gap-6 pt-5">
        <div
          className={cn(
            'relative flex size-[60px] items-center justify-center rounded-[8.82px] bg-secondary/50'
          )}
        >
          {renderIcon()}
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full truncate uppercase text-muted">
            <Paragraph size="mono">
              {formatDate(
                currentSession?.updated_at ?? currentSession?.created_at ?? '',
                'natural-with-time'
              )}
            </Paragraph>
          </div>
          <Heading size={3} className="block max-w-full truncate">
            {displayName}
          </Heading>
        </div>
        <div className="flex w-full flex-col gap-2">
          <SessionTabs />

          <RunsTabHeader />
        </div>
      </div>

      <Session />
    </div>
  )
}
export default SessionDetails

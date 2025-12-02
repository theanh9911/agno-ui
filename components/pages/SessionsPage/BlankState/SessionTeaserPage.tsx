import React from 'react'
import SessionsList from '../SessionsList'
import { useLastUsedStateStore } from '@/stores/LastUsedStateStore'
import { sessionsData, sessionsList } from '../../../../utils/MockData'
import RunsTab from '../SessionsDetails/Session/Tabs/RunsTab'
import { RunResponseContent } from '@/types/Agent'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const SessionTeaserPage = () => {
  const sidebarWidth = useLastUsedStateStore(
    (state) => state.sessionSidebarWidth
  )
  return (
    <TeaserPageWrapper className="pointer-events-none flex h-full w-full flex-col">
      <div className={`relative mx-auto flex size-full overflow-hidden px-2`}>
        <div
          style={{ width: sidebarWidth }}
          className="size-full min-w-[273px] max-w-[50%] shrink-0 px-3"
        >
          <div className="pointer-events-none size-full overflow-y-auto overflow-x-hidden pt-1">
            <SessionsList
              data={sessionsList}
              isTeam={false}
              status={'success'}
            />
          </div>
        </div>

        <div className="group relative w-1 cursor-col-resize hover:bg-border/50">
          <div className="absolute inset-y-0 -left-1 -right-1 w-3" />
        </div>

        <main className="relative mb-3 w-full min-w-0 flex-1 rounded-[10px] border border-border bg-secondary/50">
          <div className="pointer-events-none mt-10 flex size-full flex-1 flex-col overflow-y-auto px-6 py-4">
            <RunsTab
              isLoading={false}
              runs={sessionsData as unknown as RunResponseContent[]}
              isTeam={false}
              isWorkflow={false}
            />
          </div>
        </main>
      </div>
    </TeaserPageWrapper>
  )
}

export default SessionTeaserPage

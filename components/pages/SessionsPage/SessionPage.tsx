import { useEffect, useRef, useState } from 'react'
import SessionsList from './SessionsList'
import NoLoggedSession from './BlankState/NotLoggedSession'
import { useSessionsQuery } from '@/hooks/sessions'
import { SessionsProps } from './types'
import { PageWrapper } from '@/components/layouts/PageWrapper'
import SessionHeaderWrapper from './SessionHeaderWrapper'
import { cn } from '@/utils/cn'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import { Helmet } from 'react-helmet-async'
import { useLastUsedStateStore } from '@/stores/LastUsedStateStore'
import { useFilterType } from '../../../hooks/useFilterType'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'

import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import SessionTeaserPage from './BlankState/SessionTeaserPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { BlankStateWrapper } from '@/components/common/BlankState'
import { useFetchOSConfig } from '@/hooks/os'

const SessionLayout = ({ children }: SessionsProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement | null>(null)
  const sidebarWidth = useLastUsedStateStore(
    (state) => state.sessionSidebarWidth
  )
  const setSidebarWidth = useLastUsedStateStore(
    (state) => state.setSessionSidebarWidth
  )
  const { isTeam, isWorkflow } = useFilterType()
  const { data, isLoading, status, error } = useSessionsQuery()
  const { selectedDatabase } = useDatabase()
  const { data: osConfig } = useFetchOSConfig()
  const notFound =
    error instanceof Error && 'statusCode' in error && error.statusCode === 404
  const errorMessage = error?.message
  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.session?.db
  )
  const hasNoSessions = !isLoading && data?.data?.length === 0
  const { view } = usePageViewOptions()

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = e.clientX - containerRect.left
    setSidebarWidth(`${newWidth}px`)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      document.body.style.cursor = ''
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isDragging])

  const renderContent = () => {
    if (
      view === PageViewState.DISCONNECTED ||
      view === PageViewState.INACTIVE ||
      view === PageViewState.AUTH_FAILED ||
      view === PageViewState.MISSING_SECURITY_KEY
    ) {
      return (
        <PageWrapper
          customWidth={MAX_PAGE_WRAPPER_WIDTHS}
          className="overflow-hidden"
        >
          <SessionTeaserPage />
          <OsBlankState status={view} />
        </PageWrapper>
      )
    }

    return (
      <PageWrapper
        customWidth={MAX_PAGE_WRAPPER_WIDTHS}
        className={cn(
          'overflow-hidden',
          !isLoading && data?.data?.length === 0
        )}
      >
        <SessionHeaderWrapper />
        {hasNoSessions || hasNoDatabases || notFound ? (
          <>
            {notFound && (
              <NotFoundPage title="Not Found" description={errorMessage} />
            )}
            <BlankStateWrapper>
              {hasNoDatabases && (
                <NoLoggedSession noDatabases={hasNoDatabases} />
              )}
              {hasNoSessions && <NoLoggedSession />}
            </BlankStateWrapper>
          </>
        ) : (
          <div
            ref={containerRef}
            className={`relative mx-auto flex size-full overflow-hidden px-2`}
          >
            <div
              style={{ width: sidebarWidth }}
              className="size-full min-w-[273px] max-w-[50%] shrink-0 px-3"
            >
              <div className="size-full overflow-y-auto overflow-x-hidden pt-1">
                <SessionsList
                  data={data ?? undefined}
                  isTeam={isTeam}
                  status={status}
                />
              </div>
            </div>

            {/* resize handle */}
            <div
              className="group relative w-1 cursor-col-resize hover:bg-border/50"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 w-3" />
            </div>

            <main
              ref={mainRef}
              className="relative mb-3 w-full min-w-0 flex-1 rounded-[10px] border border-border bg-secondary/50"
            >
              {children}
            </main>
          </div>
        )}
      </PageWrapper>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {(() => {
            switch (true) {
              case isTeam:
                return 'Team Sessions | Agno'
              case isWorkflow:
                return 'Workflow Sessions | Agno'
              default:
                return 'Sessions | Agno'
            }
          })()}
        </title>
      </Helmet>
      {renderContent()}
    </>
  )
}
export default SessionLayout

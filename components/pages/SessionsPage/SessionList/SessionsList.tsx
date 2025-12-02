import { type FC, useRef } from 'react'
import SkeletonList from '@/components/common/Playground/SkeletonList'
import { cn } from '@/utils/cn'
import { SessionList } from '@/types/Agent'
import Session from './Session'
import Pagination from './Pagination/Pagination'
import { useSessionStore } from '@/stores/SessionsStore'
import NoLoggedSession from '../BlankState/NotLoggedSession'
import { SessionsListResponse } from '@/api/agent'

interface SessionsListProps {
  isTeam?: boolean
  isWorkflow?: boolean
  status: 'error' | 'success' | 'pending'
  data?: SessionsListResponse
}
const SessionsList: FC<SessionsListProps> = ({
  isTeam,
  isWorkflow,
  status,
  data
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pageSize = useSessionStore((state) => state.pageSize)
  const setAgentPage = useSessionStore((state) => state.setAgentPage)
  const setTeamPage = useSessionStore((state) => state.setTeamPage)
  const setWorkflowPage = useSessionStore((state) => state.setWorkflowPage)
  const sessions = data?.data ?? []

  const pagination = data?.meta
  const currentPage = pagination?.page ?? 1
  const totalPages = pagination?.total_pages ?? 1
  const totalItems = pagination?.total_count ?? 0

  const handlePageChange = (newPage: number) => {
    if (isTeam) {
      setTeamPage(newPage)
    } else if (isWorkflow) {
      setWorkflowPage(newPage)
    } else {
      setAgentPage(newPage)
    }
  }
  let content
  if (status === 'pending') {
    content = (
      <div className="mt-2 flex flex-col gap-y-2">
        <SkeletonList skeletonCount={8} />
      </div>
    )
  } else if (sessions?.length === 0 || status === 'error') {
    content = (
      <div className="mx-auto mt-20 w-[688px]">
        <NoLoggedSession />
      </div>
    )
  } else {
    content = (
      <div className="space-y-3">
        {sessions?.map((session: SessionList) => (
          <Session key={session.session_id} session={session} />
        ))}
      </div>
    )
  }
  return (
    <div
      className={cn(
        'relative flex h-full select-none flex-col overflow-hidden'
      )}
    >
      <div
        ref={containerRef}
        className="h-full flex-1 flex-col overflow-y-auto"
      >
        {content}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="Pagination-Gradient absolute bottom-0 left-0 z-[9999] flex w-full items-center justify-center pb-3 pt-8 backdrop-blur-sm">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalSessions={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
export default SessionsList

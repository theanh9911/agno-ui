import UserMemoryPageWrapper from './UserMemoryPageWrapper'
import Pagination from '../../SessionsPage/SessionsList/Pagination/Pagination'
import UserTable from './UserTable/UserTable'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'

import { useGetAllMemoryUsers } from '@/hooks/memory'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import { BlankState, BlankStateWrapper } from '@/components/common/BlankState'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import MemoryTeaserPage from '../BlankState/MemoryTeaserPage'

import { useMemoryStore } from '@/stores/MemoryStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import NotFoundPage from '@/pages/NotFoundPage'
import { MemoryDialogModeType } from '@/types/memory'
import { MemoryCreateContent } from '../Memory/MemoryCreateContent'

import { Helmet } from 'react-helmet-async'
import { useDialog } from '@/providers/DialogProvider'
import { DOC_LINKS } from '@/docs'
import { useFetchOSConfig } from '@/hooks/os/useFetchOSConfig'
import { APIError } from '@/api/errors/APIError'

export default function UserMemoryPage() {
  const { data: osConfig } = useFetchOSConfig()
  const { getCurrentUsersPagination, setUsersPage } = useMemoryStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const {
    data: userMemoriesResponse,
    isFetched,
    error
  } = useGetAllMemoryUsers()
  const hasNoUserMemories =
    isFetched && userMemoriesResponse?.meta?.total_count === 0
  const { page, limit, totalPages } = getCurrentUsersPagination(dbId)
  const itemsTotal = userMemoriesResponse?.meta?.total_count ?? 0

  const { openDialog } = useDialog()

  const handlePageChange = (newPage: number) => setUsersPage(newPage, dbId)

  const handleCreateMemory = () => {
    openDialog(<MemoryCreateContent mode={MemoryDialogModeType.CREATE} />)
  }

  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.memory?.db
  )
  const notFound =
    error instanceof Error && 'statusCode' in error && error.statusCode === 404

  const errorMessage = (error as APIError)?.message

  const { view, isTeaser } = usePageViewOptions({
    additionalChecks: () => {
      if (hasNoDatabases) return PageViewState.NO_DATABASES
      if (hasNoUserMemories) return PageViewState.EMPTY
      if (notFound) return PageViewState.NOT_FOUND
      return PageViewState.CONTENT
    }
  })
  return (
    <>
      <Helmet>
        <title>Memory | Agno</title>
      </Helmet>
      <UserMemoryPageWrapper isTeaser={isTeaser}>
        {(view === PageViewState.DISCONNECTED ||
          view === PageViewState.INACTIVE ||
          view === PageViewState.AUTH_FAILED ||
          view === PageViewState.MISSING_SECURITY_KEY) && (
          <>
            <MemoryTeaserPage />
            <OsBlankState status={view} />
          </>
        )}

        {view === PageViewState.NO_DATABASES && (
          <BlankStateWrapper>
            <BlankState
              visual="memory-blank-state-visual"
              title="No databases found"
              description="Please add a database to view memory"
            />
          </BlankStateWrapper>
        )}
        {view === PageViewState.NOT_FOUND && (
          <NotFoundPage title="Not Found" description={errorMessage} />
        )}
        {view === PageViewState.EMPTY && (
          <BlankStateWrapper>
            <BlankState
              visual="memory-blank-state-visual"
              title="No memories found"
              description="Create and view agent memories. <br/> Visit our docs for more information."
              docLink={DOC_LINKS.platform.memory.introduction}
              buttonText="Create memory"
              buttonOnClick={handleCreateMemory}
              buttonIcon="create"
            />
          </BlankStateWrapper>
        )}
        {(view === PageViewState.CONTENT || view === PageViewState.LOADING) && (
          <div className="relative flex h-full select-none flex-col overflow-hidden">
            <div className="mb-14 flex flex-col overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between gap-4 border-b border-border p-3">
                <Paragraph size="body" className="">
                  {itemsTotal} items in table
                </Paragraph>
                <Button
                  onClick={handleCreateMemory}
                  icon="create"
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={!isFetched}
                >
                  Create Memory
                </Button>
              </div>

              {/* Table content */}
              <UserTable isLoading={!isFetched} />
            </div>
            {/* Pagination */}
            {totalPages && totalPages > 1 && (
              <div className="Pagination-Gradient absolute bottom-0 left-0 z-[9999] flex h-[80px] w-full items-center justify-center backdrop-blur-sm">
                <Pagination
                  currentPage={page || 1}
                  onPageChange={handlePageChange}
                  totalPages={Math.max(1, Number(totalPages) || 1)}
                  pageSize={limit || 10}
                />
              </div>
            )}
          </div>
        )}
      </UserMemoryPageWrapper>
    </>
  )
}

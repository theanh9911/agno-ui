import { BlankState, BlankStateWrapper } from '@/components/common/BlankState'
import MemoryPageWrapper from './Memory/MemoryPageWrapper'
import { useMemoriesQuery, useMemoryDelete } from '@/hooks/memory'
import { Button } from '@/components/ui/button'
import { MemoryDeleteContent } from './Memory/MemoryDeleteContent'
import { MemoryCreateContent } from './Memory/MemoryCreateContent'
import { MemoryDetailsContent } from './Memory/MemoryDetailsContent'
import Pagination from '../SessionsPage/SessionsList/Pagination/Pagination'

import MemoryTable from './Memory/MemoryTable'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'
import BulkActionBar from '@/components/common/BulkActionBar'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Helmet } from 'react-helmet-async'
import { MemoriesResponse, Memory, MemoryDialogModeType } from '@/types/memory'

import MemoryTeaserPage from './BlankState/MemoryTeaserPage'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import { useParams, useRouter } from '@/utils/navigation'
import { useEffect } from 'react'
import { useMemoryStore } from '@/stores/MemoryStore'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import NotFoundPage from '@/pages/NotFoundPage'
import { useDialog } from '@/providers/DialogProvider'
import { DOC_LINKS } from '@/docs'
import { useFetchOSConfig } from '@/hooks/os'

export default function MemoryPage() {
  const {
    selectedMemories,
    getCurrentPagination,
    setPageForUserMemory,
    clearSelectedMemories,
    setSelectedMemories
  } = useMemoryStore()
  const { selectedDatabase } = useDatabase()
  const { data: osConfig } = useFetchOSConfig()
  const { data: memoriesResponse, isFetched, error } = useMemoriesQuery()
  const hasNoMemories =
    isFetched && (memoriesResponse as MemoriesResponse)?.meta?.total_count === 0
  const memories: Memory[] = (memoriesResponse as MemoriesResponse)?.data || []

  const router = useRouter()
  const { userId, memoryId } = useParams<{
    userId?: string
    memoryId?: string
  }>()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const { page, limit, totalPages, totalCount } = getCurrentPagination(
    userId || '',
    dbId
  )
  const navigateToUserMemoryWithCurrentSearch = (memoryToShow?: Memory) => {
    const currentSearch = router?.search || ''
    if (memoryToShow) {
      router.push(
        `/memory/${memoryToShow?.user_id}/${memoryToShow?.memory_id}${currentSearch}`
      )
    } else {
      router.push(`/memory/${userId}${currentSearch}`)
    }
  }
  const handleEmptyStateAfterDeletion = (remainingMemories?: Memory[]) => {
    if (!remainingMemories || remainingMemories?.length === 0) {
      if (page && page > 1 && userId) {
        setPageForUserMemory(userId, 1, dbId)
      }
      const currentSearch = router?.search || ''
      router.push(`/memory${currentSearch}`)
    }
  }
  // Pagination handler
  const handlePageChange = (newPage: number) => {
    if (userId) {
      setPageForUserMemory(userId, newPage, dbId)
    }
  }

  // Selection handler
  const handleCancelSelection = () => {
    clearSelectedMemories()
  }
  const deleteOperations = useMemoryDelete({
    onDeleteSuccess: (deletedIds) => {
      // Clear the deleted memory from selected memories
      const updatedSelectedMemories = new Set(selectedMemories)
      deletedIds.forEach((id) => updatedSelectedMemories.delete(id))
      setSelectedMemories(updatedSelectedMemories)

      // Calculate remaining memories after deletion
      const remainingMemories = memories?.filter(
        (memory) => !deletedIds.includes(memory?.memory_id)
      )

      // If no memories remain on current page or none remain at all, navigate appropriately
      handleEmptyStateAfterDeletion(remainingMemories)
    },
    onBulkDeleteSuccess: () => {
      // Clear selection after successful deletion
      clearSelectedMemories()

      // Calculate remaining memories after deletion
      const remainingMemories = memories?.filter(
        (memory) => !selectedMemories.has(memory?.memory_id)
      )

      // If no memories remain on current page or none remain at all, navigate appropriately
      handleEmptyStateAfterDeletion(remainingMemories)
    }
  })
  const { openDialog } = useDialog()

  const handleCreateMemory = () => {
    openDialog(
      <MemoryCreateContent mode={MemoryDialogModeType.CREATE} userId={userId} />
    )
  }

  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.memory?.db
  )

  const notFound =
    error instanceof Error && 'statusCode' in error && error.statusCode === 404
  const errorMessage = error?.message
  const { view, isTeaser } = usePageViewOptions({
    additionalChecks: () => {
      if (hasNoDatabases) return PageViewState.NO_DATABASES
      if (hasNoMemories) return PageViewState.EMPTY
      if (notFound) return PageViewState.NOT_FOUND
      return PageViewState.CONTENT
    }
  })
  const handleOpenMemoryDialog = (memoryToShow: Memory) => {
    navigateToUserMemoryWithCurrentSearch(memoryToShow)
    openDialog(<MemoryDetailsContent memory={memoryToShow} />, {
      onClose: navigateToUserMemoryWithCurrentSearch
    })
  }

  // Handle direct URL access to memory details
  useEffect(() => {
    if (memoryId && isFetched) {
      const memory = memories?.find((m) => m.memory_id === memoryId)
      if (memory) {
        handleOpenMemoryDialog(memory)
      }
    }
  }, [memoryId, memories, isFetched])

  return (
    <>
      <Helmet>
        <title>Memory | Agno</title>
      </Helmet>
      <MemoryPageWrapper isTeaser={isTeaser}>
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
          <div className="mx-auto mt-28 h-[21.25rem] w-[37.5rem]">
            <BlankState
              visual="memory-blank-state-visual"
              title="No databases found"
              description="Please add a database to view memory"
            />
          </div>
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
                  {totalCount} items in table
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
              <MemoryTable
                deleteOperations={deleteOperations}
                isLoading={!isFetched}
                onMemorySelect={(memoryId) => {
                  const memory = memories?.find((m) => m.memory_id === memoryId)
                  if (memory) {
                    handleOpenMemoryDialog(memory)
                  }
                }}
              />
            </div>

            {/* Bulk Action Bar */}
            {selectedMemories.size > 0 && (
              <BulkActionBar
                selectedCount={selectedMemories.size}
                totalCount={totalCount ?? 0}
                itemType="memories"
                onCancelSelection={handleCancelSelection}
                actions={[
                  {
                    label: 'DELETE SELECTED',
                    onClick: () => {
                      openDialog(
                        <MemoryDeleteContent
                          memoryIds={Array.from(selectedMemories)}
                          onDeleteSuccess={
                            deleteOperations.handleBulkDeleteSuccess
                          }
                        />
                      )
                    },
                    variant: 'destructive'
                  }
                ]}
                isDeleting={
                  deleteOperations.bulkDeleteMemoriesMutation?.isPending ||
                  false
                }
                isPaginated={!!(totalPages && totalPages > 1)}
                className="max-w-[520px]"
              />
            )}
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
      </MemoryPageWrapper>
    </>
  )
}

import React from 'react'
import { useDialog } from '@/providers/DialogProvider'
import EvaluationData from './EvaluationData/EvaluationData'
import Pagination from '../SessionsPage/SessionsList/Pagination/Pagination'
import SkeletonList from '@/components/common/Playground/SkeletonList'
import BulkActionBar from '@/components/common/BulkActionBar'
import { useEvaluation } from '@/components/pages/EvaluationPage/hooks/useEvaluation'
import DeleteEvalModal from './EvaluationControl/DeleteEvalModal'
import EvaluationTable from './EvaluationTable/EvaluationTable'
import EvaluationBlankState from './BlankState'
import { Helmet } from 'react-helmet-async'
import { PageWrapper } from '@/components/layouts/PageWrapper'
import { MAX_PAGE_WRAPPER_WIDTHS } from '@/constants'
import Header from '@/components/pages/EvaluationPage/Header'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'
import { useFetchOSConfig, useFetchOSStatus } from '@/hooks/os'
import { Button } from '@/components/ui/button'
import CreateEvalRunModal from './CreateEvalRunModal'
import Paragraph from '@/components/ui/typography/Paragraph'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import EvaluationTeaserPage from './BlankState/EvaluationTeaserPage'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import NotFoundPage from '@/pages/NotFoundPage'

const EvaluationPage = () => {
  const { openDialog } = useDialog()
  const { selectedDatabase } = useDatabase()
  const { isFetched } = useFetchOSStatus()
  const { data: osConfig } = useFetchOSConfig()
  const {
    evals,
    isLoading,
    error,
    selectedEvaluations,
    pendingEvaluations,
    page,
    limit,
    totalCount,
    totalPages,
    deleteOperations,
    handlePageChange,
    handleCancelSelection
  } = useEvaluation()

  const hasNoEvals =
    !isLoading &&
    evals &&
    evals.length === 0 &&
    pendingEvaluations &&
    pendingEvaluations.length === 0
  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.evals?.db
  )
  const notFound =
    error instanceof Error && 'statusCode' in error && error.statusCode === 404
  const errorMessage = error?.message
  const { view } = usePageViewOptions({
    additionalChecks: () => {
      if (hasNoDatabases) return PageViewState.NO_DATABASES
      if (hasNoEvals || (!isLoading && error)) return PageViewState.EMPTY
      if (notFound) return PageViewState.NOT_FOUND
      return PageViewState.CONTENT
    }
  })

  const renderContent = () => {
    if (
      view === PageViewState.DISCONNECTED ||
      view === PageViewState.INACTIVE ||
      view === PageViewState.AUTH_FAILED ||
      view === PageViewState.MISSING_SECURITY_KEY
    ) {
      return (
        <>
          <EvaluationTeaserPage />
          <OsBlankState status={view} />
        </>
      )
    }

    if (view === PageViewState.NO_DATABASES) {
      return (
        <>
          <Header />
          <EvaluationBlankState />
        </>
      )
    }
    if (view === PageViewState.NOT_FOUND) {
      return (
        <>
          <Header />
          <NotFoundPage title="Not Found" description={errorMessage} />
        </>
      )
    }
    if (view === PageViewState.EMPTY) {
      return (
        <>
          <Header />
          <EvaluationBlankState hasEvaluations={false} hasError={!!error} />
        </>
      )
    }

    return (
      <>
        <Header />
        <div className="flex size-full gap-2 overflow-y-auto px-2">
          <div className="relative flex h-full w-[45%] select-none flex-col overflow-hidden">
            {isLoading || !isFetched || (!evals && !error) ? (
              <SkeletonList skeletonCount={4} />
            ) : (
              <div className="flex h-full flex-col gap-1">
                <div className="flex items-center justify-between pl-4 pr-4">
                  {totalCount != null && (
                    <Paragraph size="title">
                      {totalCount > 0
                        ? `${totalCount} ${totalCount > 1 ? 'items' : 'item'} in table`
                        : 'No items in table'}
                    </Paragraph>
                  )}
                  <Button
                    variant="default"
                    className="w-fit"
                    icon="plus"
                    size="default"
                    onClick={() => {
                      openDialog(<CreateEvalRunModal />)
                    }}
                  >
                    New Eval
                  </Button>
                </div>
                <EvaluationTable deleteOperations={deleteOperations} />
              </div>
            )}

            <BulkActionBar
              selectedCount={selectedEvaluations.size}
              totalCount={totalCount ?? 0}
              itemType="items"
              onCancelSelection={handleCancelSelection}
              actions={[
                {
                  label: 'DELETE SELECTED',
                  onClick: () => {
                    openDialog(
                      <DeleteEvalModal
                        evaluationIds={Array.from(selectedEvaluations)}
                      />
                    )
                  },
                  variant: 'destructive'
                }
              ]}
              isDeleting={deleteOperations.deleteEvalsMutation.isPending}
              isPaginated={!!totalPages && totalPages > 1}
              className="max-w-[520px]"
            />

            {!!totalPages && totalPages > 1 && (
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

          <div className="mb-2 flex w-[55%] flex-col gap-4 overflow-hidden rounded-md border border-border bg-secondary/50">
            <div className="w-full overflow-y-auto p-6">
              {isLoading || !evals ? (
                <SkeletonList skeletonCount={8} />
              ) : (
                <>
                  <EvaluationData />
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Evaluations | Agno</title>
      </Helmet>
      <PageWrapper
        customWidth={MAX_PAGE_WRAPPER_WIDTHS}
        className="relative overflow-hidden"
      >
        {renderContent()}
      </PageWrapper>
    </>
  )
}

export default EvaluationPage

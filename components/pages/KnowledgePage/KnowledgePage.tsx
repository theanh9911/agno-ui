import React, { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import { useParams, useRouter } from '@/utils/navigation'
import { useDialog } from '@/providers/DialogProvider'
import { useBulkDeleteDocuments } from '@/hooks/knowledge/useBulkDeleteDocuments'
import { DeleteModal } from '@/components/modals/DeleteModal'

import { useKnowledgeStore } from '@/stores/KnowledgeStore'

import { useFetchOSConfig } from '@/hooks/os'
import useGetDocuments from '@/hooks/knowledge/useGetDocuments'

import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import BulkActionBar from '@/components/common/BulkActionBar'
import { BlankState, BlankStateWrapper } from '@/components/common/BlankState'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import Pagination from '../SessionsPage/SessionsList/Pagination/Pagination'

import { KnowledgeDocument, KnowledgePageMode } from '@/types/Knowledge'

import KnowledgePageWrapper from './KnowledgePageWrapper'
import ContentTable from './ContentTable/ContentTable'

import KnowledgeTeaserPage from './BlankState/knowledgeTeaserPage'
import KnowledgeDialogs from './KnowledgeDialogs'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import NotFoundPage from '@/pages/NotFoundPage'
import { DOC_LINKS } from '@/docs'
import Link from '@/components/ui/Link'
import {
  PageViewState,
  usePageViewOptions
} from '@/hooks/os/usePageViewOptions'

export default function KnowledgePage() {
  const {
    page,
    totalPages,
    limit,
    setPage,
    selectedDocuments,
    setSelectedDocuments,

    setSelectedDocument,
    setContentDialogMode
  } = useKnowledgeStore()
  const { selectedDatabase } = useDatabase()
  const { id } = useParams<{ id?: string }>()
  const router = useRouter()

  const { data: documents, isFetched, error } = useGetDocuments()
  const { data: osConfig } = useFetchOSConfig()

  const itemsTotal = documents?.meta?.total_count ?? 0
  const hasNoDocuments = isFetched && documents?.meta.total_count === 0
  const hasNoDatabases = Boolean(
    osConfig && selectedDatabase && !selectedDatabase?.knowledge?.db
  )

  const knowledgeNotFound =
    error && 'statusCode' in error && error.statusCode === 404
  const { view, isTeaser } = usePageViewOptions({
    additionalChecks: () => {
      if (hasNoDatabases) return PageViewState.NO_DATABASES
      if (hasNoDocuments) return PageViewState.EMPTY
      if (knowledgeNotFound) return PageViewState.NOT_FOUND
      return PageViewState.CONTENT
    }
  })
  useEffect(() => {
    if (id) {
      const document = documents?.data?.find(
        (document: KnowledgeDocument) => document.id === id
      )
      setSelectedDocument(document || null)
    }
  }, [id, documents, setSelectedDocument])

  const handleCancelSelection = () => {
    setSelectedDocuments(new Set())
  }
  const handleCloseModal = () => {
    setContentDialogMode(null)
    const currentSearch = router?.search || window?.location?.search || ''
    const searchParams = new URLSearchParams(currentSearch)
    searchParams.delete('edit')
    router.push(
      `/knowledge${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    )
  }

  const { openDialog } = useDialog()

  const { mutate: bulkDeleteDocuments, isPending: isBulkDeleting } =
    useBulkDeleteDocuments()

  const actions = useMemo(
    () => [
      {
        label: 'DELETE SELECTED',
        onClick: () =>
          openDialog(
            <DeleteModal
              count={selectedDocuments.size}
              onDelete={async () => {
                await bulkDeleteDocuments(Array.from(selectedDocuments))
                setSelectedDocuments(new Set())
              }}
              isLoading={isBulkDeleting}
            />
          ),
        variant: 'destructive' as const
      }
    ],
    [
      openDialog,
      selectedDocuments,
      bulkDeleteDocuments,
      isBulkDeleting,
      setSelectedDocuments
    ]
  )

  return (
    <>
      <Helmet>
        <title>Knowledge | Agno</title>
      </Helmet>
      <KnowledgePageWrapper isTeaser={isTeaser}>
        {(view === PageViewState.DISCONNECTED ||
          view === PageViewState.INACTIVE ||
          view === PageViewState.AUTH_FAILED ||
          view === PageViewState.MISSING_SECURITY_KEY) && (
          <>
            <KnowledgeTeaserPage />
            <OsBlankState status={view} />
          </>
        )}

        {view === PageViewState.NO_DATABASES && (
          <BlankStateWrapper>
            <BlankState
              visual="knowledge-blank-state-icon"
              title="No databases found"
              description="Please add a database to view knowledge"
            />
          </BlankStateWrapper>
        )}

        {view === PageViewState.NOT_FOUND && (
          <NotFoundPage
            title="Can't connect to your Knowledge database"
            description="Please configure your first Knowledge base to get started."
            buttons={[
              <Button
                type="button"
                key="primary"
                variant="secondary"
                icon="external-link"
                iconPosition="right"
              >
                <Link
                  href={DOC_LINKS.platform.knowledge.introduction}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  DOCS
                </Link>
              </Button>
            ]}
          />
        )}

        {view === PageViewState.EMPTY && (
          <BlankStateWrapper>
            <BlankState
              visual="knowledge-blank-state-icon"
              title="No content in knowledge base"
              description="Add and view knowledge base content. <br/> Visit our docs for more information."
              docLink={DOC_LINKS.platform.knowledge.introduction}
              buttonText="Add Content"
              buttonOnClick={() =>
                setContentDialogMode(KnowledgePageMode.SELECTOR)
              }
              buttonIcon="create"
            />
          </BlankStateWrapper>
        )}

        {(view === PageViewState.CONTENT || view === PageViewState.LOADING) && (
          <div className="relative flex size-full select-none flex-col overflow-hidden">
            <div className="z-10 mb-14 flex flex-col overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between gap-4 border-b border-border p-3">
                <Paragraph size="title">{itemsTotal} items in table</Paragraph>

                <Button
                  icon="create"
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={() =>
                    setContentDialogMode(KnowledgePageMode.SELECTOR)
                  }
                  disabled={!isFetched}
                >
                  ADD CONTENT
                </Button>
              </div>

              <ContentTable
                selectedItems={selectedDocuments}
                onSelectionChange={setSelectedDocuments}
                isLoading={!isFetched}
              />

              {selectedDocuments.size > 0 && (
                <BulkActionBar
                  selectedCount={selectedDocuments.size}
                  totalCount={itemsTotal}
                  itemType="items"
                  onCancelSelection={handleCancelSelection}
                  actions={actions}
                  isDeleting={false}
                  isPaginated={!!totalPages && totalPages > 1}
                  className="flex justify-center"
                />
              )}
            </div>

            {/* Pagination */}
            {totalPages && totalPages > 1 && (
              <div className="Pagination-Gradient absolute bottom-0 left-0 z-[9999] flex h-[80px] w-full items-center justify-center backdrop-blur-sm">
                <Pagination
                  currentPage={page}
                  onPageChange={(newPage) => setPage(newPage)}
                  totalPages={totalPages}
                  pageSize={limit}
                />
              </div>
            )}
          </div>
        )}
      </KnowledgePageWrapper>

      <KnowledgeDialogs onClosePrimary={handleCloseModal} />
    </>
  )
}

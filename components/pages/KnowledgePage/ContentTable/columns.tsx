import { useEffect, useRef, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'

import { useOSStore } from '@/stores/OSStore'
import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import { useGetDocumentStatus } from '@/hooks/knowledge/useDocumentStatus'
import { useSortBy } from '@/hooks/useSortBy'

import { KnowledgeDocument, DocumentStatusEnums } from '@/types/Knowledge'
import { getContentTypeIcon, getFileType, metadataTags } from '../utils'
import { formatDate } from '@/utils/format'
import { EditDeleteCTAs } from '../Actions/EditDeleteCTAs'
import { CACHE_KEYS } from '@/constants'

import Paragraph from '@/components/ui/typography/Paragraph/Paragraph'
import { TagList } from '@/components/common/TagControls'
import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import Tooltip from '@/components/common/Tooltip'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'

const DocumentStatusCell = ({ document }: { document: KnowledgeDocument }) => {
  const queryClient = useQueryClient()
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const { page, limit } = useKnowledgeStore()
  const { sortBy } = useSortBy()
  const { data: documentStatus } = useGetDocumentStatus(document)
  const hasInvalidatedRef = useRef(false)

  const currentStatus = documentStatus?.status ?? document.status
  const previousStatus = document.status
  const dbId = selectedDatabase?.knowledge?.db?.db_id || ''
  const table = selectedDatabase?.knowledge?.table || ''
  useEffect(() => {
    if (
      !hasInvalidatedRef.current &&
      documentStatus?.status &&
      previousStatus === DocumentStatusEnums.PROCESSING &&
      documentStatus.status !== DocumentStatusEnums.PROCESSING
    ) {
      hasInvalidatedRef.current = true
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.KNOWLEDGE({
          OSId: currentOS?.id ?? null,
          dbId: dbId,
          page: page ?? 1,
          limit: limit ?? 20,
          sortBy: sortBy || '',
          table: table || ''
        })
      })
    }
  }, [
    documentStatus?.status,
    previousStatus,
    queryClient,
    currentOS?.id,
    dbId,
    page,
    limit,
    sortBy
  ])

  const statusMessage =
    documentStatus?.status_message || document.status_message

  return (
    <div className="flex items-center justify-end">
      {currentStatus === DocumentStatusEnums.FAILED && statusMessage ? (
        <Tooltip
          content={
            <Paragraph size="body" className="text-accent">
              {statusMessage}
            </Paragraph>
          }
          side="top"
          contentClassName="max-w-xs text-wrap break-words"
        >
          <Badge
            icon="alert-triangle"
            variant="destructive"
            className="bg-destructive/50 uppercase hover:bg-destructive/50"
          >
            {currentStatus}
          </Badge>
        </Tooltip>
      ) : (
        <Badge
          icon={
            currentStatus === DocumentStatusEnums.PROCESSING
              ? 'loader-2'
              : 'check'
          }
          variant="secondary"
          className="uppercase"
        >
          {currentStatus}
        </Badge>
      )}
    </div>
  )
}

const DocumentActionsCell = ({ document }: { document: KnowledgeDocument }) => {
  const { data: documentStatus } = useGetDocumentStatus(document)
  const currentStatus = documentStatus?.status ?? document.status

  return (
    <div className="flex justify-end">
      <EditDeleteCTAs document={document} status={currentStatus} />
    </div>
  )
}

export const useColumns = (): ColumnDef<KnowledgeDocument>[] => {
  const columns = useMemo<ColumnDef<KnowledgeDocument>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const document = row.original
          return (
            <div className="flex w-full flex-col gap-1">
              <Paragraph size="title" className="truncate text-primary">
                {document.name}
              </Paragraph>
              {document.description && (
                <Paragraph size="xsmall" className="truncate text-primary/50">
                  {document.description}
                </Paragraph>
              )}
            </div>
          )
        },
        meta: {
          className: 'w-[15%]'
        }
      },
      {
        accessorKey: 'type',
        header: 'Content type',
        cell: ({ row }) => {
          const document = row.original
          return (
            <div className="flex items-center gap-2">
              <Icon
                type={getContentTypeIcon(document?.type)}
                size={20}
                className="text-brand"
              />
              <Paragraph size="xsmall" className="text-primary">
                {getFileType(document.type)}
              </Paragraph>
            </div>
          )
        },
        meta: {
          className: 'w-[15%]'
        }
      },
      {
        accessorKey: 'metadata',
        header: 'Metadata',
        cell: ({ row }) => {
          const document = row.original
          return (
            <div className="truncate text-xs">
              {document.metadata &&
              Object.keys(document.metadata).length > 0 ? (
                <TagList tags={metadataTags(document)} wrapLimit={2} />
              ) : (
                <Icon
                  type="divider-horizontal"
                  size="xs"
                  className="text-muted"
                />
              )}
            </div>
          )
        },
        meta: {
          className: 'w-[40%]'
        }
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-right">Status</div>,
        cell: ({ row }) => {
          const document = row.original
          return <DocumentStatusCell document={document} />
        },
        meta: {
          className: 'w-[10%]'
        }
      },
      {
        accessorKey: 'updated_at',
        header: () => <div className="text-right">Updated at</div>,
        cell: ({ row }) => {
          const document = row.original
          return (
            <Paragraph size="title" className="truncate text-right text-muted">
              {formatDate(document?.updated_at, 'date-with-24h-time')}
            </Paragraph>
          )
        },
        meta: {
          className: 'w-[10%]'
        }
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const document = row.original
          return <DocumentActionsCell document={document} />
        },
        meta: {
          className: 'w-[10%]'
        }
      }
    ],
    []
  )

  return columns
}

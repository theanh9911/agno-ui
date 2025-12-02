import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Memory } from '@/types/memory'
import Paragraph from '@/components/ui/typography/Paragraph'
import { TagList } from '@/components/common/TagControls'
import Icon from '@/components/ui/icon'
import { formatDate } from '@/utils/format'
import { ActionButtons } from '../MemoryComponents'

export const useColumns = (
  onEdit: (e: React.MouseEvent, memory: Memory) => void,
  onDelete: (e: React.MouseEvent, memory: Memory) => void
): ColumnDef<Memory>[] => {
  const columns = useMemo<ColumnDef<Memory>[]>(
    () => [
      {
        accessorKey: 'memory',
        header: 'Content',
        cell: ({ row }) => {
          const memory = row.original
          return (
            <Paragraph className="truncate text-primary" size="title">
              {memory.memory}
            </Paragraph>
          )
        },
        meta: { className: 'w-[44%] truncate' }
      },
      {
        accessorKey: 'topics',
        header: 'Topics',
        cell: ({ row }) => {
          const memory = row.original
          return memory.topics && memory.topics.length > 0 ? (
            <div className="truncate text-xs">
              <TagList tags={memory.topics} wrapLimit={3} />
            </div>
          ) : (
            <Icon type="divider-horizontal" size="xs" className="text-muted" />
          )
        },
        meta: { className: 'w-[29%] truncate text-xs' }
      },
      {
        accessorKey: 'updated_at',
        header: () => <div className="text-right">Updated at</div>,
        cell: ({ row }) => {
          const memory = row.original
          return (
            <Paragraph size="title" className="truncate text-right text-muted">
              {formatDate(memory.updated_at, 'date-with-24h-time')}
            </Paragraph>
          )
        },
        meta: { className: 'w-[12%] truncate text-right' }
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const memory = row.original
          return (
            <div className="flex justify-end">
              <ActionButtons
                memory={memory}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )
        },
        meta: { className: 'w-[12%] truncate' }
      }
    ],
    [onEdit, onDelete]
  )

  return columns
}

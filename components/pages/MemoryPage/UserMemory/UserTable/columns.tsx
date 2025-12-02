import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate, formatLargeNumber } from '@/utils/format'
import { UserMemory } from '@/types/memory'

import Paragraph from '@/components/ui/typography/Paragraph/Paragraph'
import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/api/hooks/queries'

export const useColumns = (): ColumnDef<UserMemory>[] => {
  const { data: userData } = useUser()
  const currentUserUsername = userData?.user.username
  const columns = useMemo<ColumnDef<UserMemory>[]>(
    () => [
      {
        accessorKey: 'user_id',
        header: 'User ID',
        cell: ({ row }) => {
          const userMemory = row.original
          return (
            <div className="flex items-center gap-2">
              <Paragraph size="title" className="truncate text-primary">
                {userMemory.user_id}
              </Paragraph>
              {currentUserUsername === userMemory.user_id && (
                <Badge variant="outline" className="uppercase">
                  you
                </Badge>
              )}
            </div>
          )
        },
        meta: {
          className: 'w-[50%]'
        }
      },
      {
        accessorKey: 'total_memories',
        header: () => <div className="text-right">Total Memories</div>,
        cell: ({ row }) => {
          const userMemory = row.original
          return (
            <Paragraph className="truncate text-right" size="title">
              {formatLargeNumber(userMemory.total_memories)}
            </Paragraph>
          )
        },
        meta: {
          className: 'w-[20%]'
        }
      },
      {
        accessorKey: 'last_memory_updated_at',
        header: () => <div className="text-right">Last Memory Updated At</div>,
        cell: ({ row }) => {
          const userMemory = row.original
          return (
            <Paragraph size="title" className="truncate text-right text-muted">
              {formatDate(
                userMemory.last_memory_updated_at,
                'date-with-24h-time'
              )}
            </Paragraph>
          )
        },
        meta: {
          className: 'w-[20%]'
        }
      },
      {
        id: 'icon',
        header: '',
        cell: () => (
          <div className="pl-4 text-right">
            <Icon type="caret-right" size="xs" className="flex-shrink-0" />
          </div>
        ),
        meta: {
          className: 'w-[5%]'
        }
      }
    ],
    []
  )

  return columns
}

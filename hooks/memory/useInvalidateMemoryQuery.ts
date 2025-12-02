import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { CACHE_KEYS, CACHE_KEY_PREFIX } from '@/constants'
import { useMemoryStore } from '@/stores/MemoryStore'
import { useParams } from 'react-router-dom'
import { useOSStore } from '@/stores/OSStore'
import { SortBy } from '@/types/filter'
import { logError } from '@/utils/error'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useSortBy } from '../useSortBy'

export const useInvalidateMemoryQuery = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { currentOS } = useOSStore()
  const OSId = currentOS?.id ?? null
  const params = useParams<{ '*'?: string }>()
  // The route is defined as memory/* (splat route), so userId is captured as params['*']
  const userId = params['*']
  const { getCurrentPagination, getCurrentUsersPagination } = useMemoryStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase.memory?.db?.db_id ?? ''
  const table = selectedDatabase.memory?.table || ''
  const { page, limit } = getCurrentPagination(userId || '', dbId)
  const { page: usersPage, limit: usersLimit } = getCurrentUsersPagination(dbId)

  const { sortBy: sortByVal } = useSortBy()
  const sortBy = sortByVal || SortBy.UPDATED_AT_DESC

  // Invalidate specific current page for user memories
  const invalidateCurrentPage = async (targetUserId?: string) => {
    if (!OSId || !selectedDatabase?.memory) return
    const effectiveUserId = targetUserId || userId
    try {
      const queryKey = CACHE_KEYS.APP_MEMORIES({
        OSId,
        dbId: dbId,
        memoryId: 'all',
        sort_by:
          sortBy === SortBy.UPDATED_AT_ASC
            ? SortBy.UPDATED_AT_ASC
            : SortBy.UPDATED_AT_DESC,
        page,
        limit,
        userId: effectiveUserId,
        table: table
      })

      await invalidateQuery({
        queryKey,
        refetchType: 'all'
      })
    } catch (error) {
      if (error) {
        logError(error as Error)
      }
    }
  }

  // Invalidate specific current page for users list
  const invalidateUsersCurrentPage = async () => {
    if (!OSId || !selectedDatabase?.memory) return
    try {
      const queryKey = CACHE_KEYS.APP_MEMORIES_USERS({
        OSId,
        dbId: dbId,
        memoryId: 'all',
        page: usersPage,
        limit: usersLimit,
        table: table
      })

      await invalidateQuery({
        queryKey,
        refetchType: 'all'
      })
    } catch (error) {
      if (error) {
        logError(error as Error)
      }
    }
  }

  // Invalidate memory cache entries for a specific user
  const invalidateAllMemories = async (targetUserId?: string) => {
    if (!OSId || !selectedDatabase.memory) return

    // If targetUserId is provided, only invalidate that user's memories
    const memoryQueryKey = targetUserId
      ? [CACHE_KEY_PREFIX.APP_MEMORIES, OSId, dbId, 'all', targetUserId]
      : [CACHE_KEY_PREFIX.APP_MEMORIES, OSId, dbId]

    await invalidateQuery([
      {
        queryKey: memoryQueryKey,
        exact: targetUserId ? true : false
      },
      {
        queryKey: [CACHE_KEY_PREFIX.APP_MEMORIES_USERS, OSId, dbId],
        exact: false
      }
    ])
  }

  return {
    invalidateCurrentPage,
    invalidateUsersCurrentPage,
    invalidateAllMemories
  }
}

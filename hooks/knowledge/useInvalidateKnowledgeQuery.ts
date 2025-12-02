import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { CACHE_KEYS, CACHE_KEY_PREFIX } from '@/constants'
import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import { useOSStore } from '@/stores/OSStore'
import { logError } from '@/utils/error'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useSortBy } from '../useSortBy'

export const useInvalidateKnowledgeQuery = () => {
  const { invalidateQuery } = useInvalidateQuery()
  const { page, limit } = useKnowledgeStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.knowledge?.db?.db_id ?? ''
  const table = selectedDatabase.knowledge?.table || ''
  const { currentOS } = useOSStore()
  const endpoint = currentOS?.endpoint_url ?? null
  const { sortBy } = useSortBy()
  const OSId = currentOS?.id ?? null

  const invalidateDocumentStatusQueries = async () => {
    if (!endpoint || !dbId) return

    const documentStatusQueryKey = CACHE_KEYS.KNOWLEDGE_DOCUMENT_STATUS({
      OSId,
      dbId,
      sortBy: sortBy ?? '',
      page: 1,
      limit: 10,
      table: table
    })

    await invalidateQuery({
      queryKey: documentStatusQueryKey,
      exact: false,
      refetchType: 'all'
    })
  }

  // Invalidate specific current page
  const invalidateCurrentPage = async () => {
    if (!endpoint || !dbId) return
    try {
      const queryKey = CACHE_KEYS.KNOWLEDGE({
        OSId,
        dbId,
        page,
        limit,
        sortBy: sortBy ?? '',
        table: table
      })

      await invalidateQuery({
        queryKey
      })
    } catch (error) {
      if (error) {
        logError(error as Error)
      }
    }

    await invalidateDocumentStatusQueries()
  }

  const invalidateAllKnowledge = async () => {
    if (!endpoint || !dbId) return

    await invalidateQuery({
      queryKey: [CACHE_KEY_PREFIX.KNOWLEDGE, OSId, dbId],
      exact: false
    })

    await invalidateDocumentStatusQueries()
  }

  return {
    invalidateCurrentPage,
    invalidateAllKnowledge,
    invalidateDocumentStatusQueries
  }
}

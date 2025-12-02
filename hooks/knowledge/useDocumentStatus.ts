import { getDocumentStatus } from '@/api/knowledge'
import { useOSStore } from '@/stores/OSStore'
import { useQuery } from '@tanstack/react-query'
import { CACHE_KEYS } from '@/constants'
import { DocumentStatusEnums, KnowledgeDocument } from '@/types/Knowledge'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useSortBy } from '../useSortBy'

export function useGetDocumentStatus(document: KnowledgeDocument) {
  const { currentOS } = useOSStore()
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.knowledge?.db?.db_id ?? ''
  const table = selectedDatabase.knowledge?.table || ''
  const { sortBy } = useSortBy()

  return useQuery({
    queryKey: [
      ...CACHE_KEYS.KNOWLEDGE_DOCUMENT_STATUS({
        OSId: currentOS?.id ?? '',
        dbId,
        sortBy: sortBy ?? '',
        page: 1,
        limit: 10,
        table: table
      }),
      document.id
    ],
    queryFn: async () => {
      const response = await getDocumentStatus(
        currentOS?.endpoint_url || '',
        dbId,
        document.id,
        table
      )
      return response.body
    },

    enabled:
      !!dbId &&
      !!document.status &&
      !!sortBy &&
      !!currentOS?.id &&
      document.status === DocumentStatusEnums.PROCESSING,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: (query) => {
      return !query.state.data ||
        query.state.data?.status === DocumentStatusEnums.PROCESSING
        ? 5000
        : false
    },
    staleTime: 0,
    retry: false
  })
}

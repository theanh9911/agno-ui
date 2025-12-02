import { useCallback } from 'react'
import { useInvalidateKnowledgeQuery } from '@/hooks/knowledge/useInvalidateKnowledgeQuery'
import { useInvalidateKnowledgeQuery as useInvalidateKnowledgeQuery2 } from '@/hooks/knowledge2/useInvalidateKnowledgeQuery'

export const useKnowledgeRefresh = () => {
  const {
    invalidateCurrentPage: invalidateKnowledge,
    invalidateDocumentStatusQueries
  } = useInvalidateKnowledgeQuery()

  const refresh = useCallback(async () => {
    await Promise.all([
      invalidateKnowledge(),
      invalidateDocumentStatusQueries()
    ])
  }, [invalidateKnowledge, invalidateDocumentStatusQueries])

  return refresh
}

export const useKnowledgeRefresh2 = () => {
  const { invalidateCurrentPage: invalidateKnowledge } =
    useInvalidateKnowledgeQuery2()

  const refresh = useCallback(async () => {
    await invalidateKnowledge()
  }, [invalidateKnowledge])

  return refresh
}

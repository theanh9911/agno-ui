import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useInvalidateMemoryQuery } from '@/hooks/memory/useInvalidateMemoryQuery'
import { useInvalidateMemoryQuery as useInvalidateMemoryQuery2 } from '@/hooks/memory2/useInvalidateMemoryQuery'

export const useMemoryRefresh = () => {
  const params = useParams<{ userId?: string }>()
  const {
    invalidateCurrentPage: invalidateMemory,
    invalidateUsersCurrentPage: invalidateMemoryUsers
  } = useInvalidateMemoryQuery()

  const userId = params.userId

  const refresh = useCallback(async () => {
    if (userId) {
      // We're on /memory/:userId - only invalidate that specific user's memories
      await invalidateMemory()
    } else {
      // We're on /memory root - only invalidate the users list (not individual memories)
      await invalidateMemoryUsers()
    }
  }, [userId, invalidateMemoryUsers, invalidateMemory])

  return refresh
}

export const useMemoryRefresh2 = () => {
  const { invalidateCurrentPage: invalidateMemory } =
    useInvalidateMemoryQuery2()

  const refresh = useCallback(async () => {
    await invalidateMemory()
  }, [invalidateMemory])

  return refresh
}

import { QueryClient, InfiniteData } from '@tanstack/react-query'
import { SessionEntry, SessionsData } from '@/types/playground'

/**
 * Session management utilities
 */
export const sessionUtils = {
  /**
   * Updates session in query cache and returns the session ID
   */
  updateSessionInCache: (
    queryClient: QueryClient,
    queryKey: unknown[],
    chunk_session_id: string,
    chunk_created_at: number | string,
    formData: FormData,
    currentSessionId: string | null
  ): string => {
    // Insert when no current session OR when a different session id starts streaming
    if (!currentSessionId || currentSessionId !== chunk_session_id) {
      const sessionData: SessionEntry = {
        session_id: chunk_session_id,
        session_name: (formData.get('message') as string) || 'Session',
        created_at: chunk_created_at,
        session_state: ''
      }
      const applyUpdate = (oldData: InfiniteData<SessionsData> | undefined) => {
        // Initialize when cache is empty
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ data: [sessionData], meta: { page: 1, total_pages: 1 } }],
            pageParams: [1]
          }
        }

        // Skip if already exists anywhere
        const exists = oldData.pages.some((p) =>
          p.data.some((s) => s.session_id === chunk_session_id)
        )
        if (exists) return oldData

        // Append new session at the top of the first page
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => ({
            ...page,
            data:
              index === 0
                ? ([sessionData, ...page.data] as SessionEntry[])
                : (page.data as SessionEntry[])
          }))
        }
      }

      // Update only the provided key
      queryClient.setQueryData<InfiniteData<SessionsData>>(
        queryKey,
        applyUpdate
      )
    }

    return chunk_session_id
  },

  /**
   * Removes session from query cache (used on error)
   */
  removeSessionFromCache: (
    queryClient: QueryClient,
    queryKey: unknown[],
    sessionId: string
  ): void => {
    queryClient.setQueryData<InfiniteData<SessionsData>>(
      queryKey,
      (oldData) => {
        if (!oldData || !oldData.pages) {
          return {
            pages: [{ data: [], meta: { page: 1, total_pages: 1 } }],
            pageParams: []
          }
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter(
              (session: SessionEntry) => session.session_id !== sessionId
            )
          }))
        }
      }
    )
  }
}

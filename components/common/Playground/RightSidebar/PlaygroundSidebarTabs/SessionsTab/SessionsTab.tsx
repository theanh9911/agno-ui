import { memo, useCallback, useMemo, useEffect, useRef } from 'react'
import SessionItem from '@/components/common/Playground/SessionItem'
import SkeletonList from '@/components/common/Playground/SkeletonList'
import SessionsBlankState from '@/components/common/Playground/BlankStates/SessionsBlankState'
import { useOSStore } from '@/stores/OSStore'
import Icon from '@/components/ui/icon'
import { SessionsListResponse } from '@/api/agent'
import { SessionList } from '@/types/Agent'
import useFetchPlaygroundSessions from '@/hooks/playground/useFetchPlaygroundSessions'
import type { InfiniteData } from '@tanstack/react-query'
import { useWorkflowsStore } from '@/stores/workflowsStore'

type FallbackSessionsPage = {
  data: never[]
  meta: { page: number; total_pages: number }
}

type SessionsInfiniteData = InfiniteData<
  SessionsListResponse | FallbackSessionsPage
>

interface SessionsTabProps {
  sessionsData?: SessionsInfiniteData
  isLoading?: boolean
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onRenameSession?: (sessionId: string, newName: string) => void
  onDeleteSession?: (sessionId: string) => void
  onLoadSession?: (sessionId: string) => void
}

const SessionsTab = ({
  sessionsData,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onRenameSession,
  onDeleteSession,
  onLoadSession
}: SessionsTabProps) => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null

  // Fallback to internal fetching when props are not provided
  const internal = useFetchPlaygroundSessions()
  const resolvedSessionsData =
    sessionsData ?? (internal.data as SessionsInfiniteData | undefined)
  const resolvedIsLoading = isLoading ?? internal.isLoading
  const resolvedFetchNextPage =
    fetchNextPage ?? (() => internal.fetchNextPage())
  const resolvedHasNextPage = hasNextPage ?? Boolean(internal.hasNextPage)
  const resolvedIsFetchingNextPage =
    isFetchingNextPage ?? Boolean(internal.isFetchingNextPage)
  const handleRename = onRenameSession ?? (() => {})
  const handleDelete = onDeleteSession ?? (() => {})
  const handleLoad = onLoadSession ?? (() => {})

  const shouldShowLoader = Boolean(resolvedHasNextPage) && !resolvedIsLoading

  // Flatten all sessions from all pages
  const allSessions = useMemo<SessionList[]>(() => {
    if (!resolvedSessionsData?.pages) return []
    return resolvedSessionsData.pages.flatMap(
      (page) => page.data ?? []
    ) as SessionList[]
  }, [resolvedSessionsData])

  const sessionStreamingStates = useWorkflowsStore(
    (state) => state.sessionStreamingStates
  )
  const streamingWorkflowRuns = useWorkflowsStore(
    (state) => state.streamingWorkflowRuns
  )

  const handleRenameSession = (sessionId: string, newName: string) => {
    handleRename(sessionId, newName)
  }

  const handleDeleteSession = (sessionId: string) => {
    handleDelete(sessionId)
  }

  const handleLoadSession = useCallback(
    (sessId: string) => {
      handleLoad(sessId)
    },
    [handleLoad]
  )

  const handleFetchNextPage = useCallback(async () => {
    if (resolvedIsFetchingNextPage || !resolvedHasNextPage) {
      return
    }

    await resolvedFetchNextPage()
  }, [resolvedFetchNextPage, resolvedHasNextPage, resolvedIsFetchingNextPage])

  useEffect(() => {
    const loaderElement = loaderRef.current

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // Only observe if loader is visible and shouldShowLoader is true
    if (!loaderElement || !shouldShowLoader) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          handleFetchNextPage()
        }
      },
      {
        threshold: 0.1
      }
    )

    observerRef.current.observe(loaderElement)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [shouldShowLoader, handleFetchNextPage])

  if (resolvedIsLoading) return <SkeletonList skeletonCount={5} />

  if (!selectedEndpoint || allSessions?.length === 0)
    return <SessionsBlankState />

  return (
    <div className="flex flex-col gap-y-2">
      {allSessions?.map((entry: SessionList) => {
        const sessionId = entry.session_id
        const isStreaming = Boolean(
          sessionStreamingStates?.[sessionId]?.isStreaming
        )
        // TODO: Remove this once we have a proper way to handle session names
        let fallbackName = 'Untitled Session'
        if (
          isStreaming &&
          (!entry.session_name || entry.session_name.trim() === '') &&
          entry.session_id
        ) {
          const streamingRuns = streamingWorkflowRuns?.[sessionId] || []
          // Use the first streaming run as the source for run_input
          const latestStreaming =
            streamingRuns.length > 0 ? streamingRuns[0] : null
          if (latestStreaming?.run_input) {
            fallbackName = latestStreaming.run_input.trim()
          }
        }

        const sessionName = entry.session_name || fallbackName

        return (
          <SessionItem
            key={sessionId}
            sessionName={sessionName}
            session_id={sessionId}
            onRename={handleRenameSession}
            onLoadSession={handleLoadSession}
            onDelete={handleDeleteSession}
            isStreaming={isStreaming}
          />
        )
      })}

      {shouldShowLoader && (
        <div ref={loaderRef} className="mx-auto w-full py-2">
          <Icon type="loader" size="xs" className="animate-spin" />
        </div>
      )}
    </div>
  )
}

export default memo(SessionsTab)

import { Button } from '@/components/ui/button'
import { useSheet } from '@/providers/SheetProvider'
import React, { useEffect, useRef } from 'react'
import SessionsTab from '../../RightSidebar/PlaygroundSidebarTabs/SessionsTab/SessionsTab'
import useRenameSession from '@/hooks/sessions/useRenameSession'
import useDeleteSession from '@/hooks/sessions/useDeleteSession'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import useFetchPlaygroundSessions from '@/hooks/playground/useFetchPlaygroundSessions'
import type { InfiniteData } from '@tanstack/react-query'
import { SessionsListResponse } from '@/api/agent'

type FallbackSessionsPage = {
  data: never[]
  meta: { page: number; total_pages: number }
}

type SessionsInfiniteData = InfiniteData<
  SessionsListResponse | FallbackSessionsPage
>

interface SessionsSheetData {
  sessionsData?: SessionsInfiniteData
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}

const ChatSessionsSheet = () => {
  const { openSheet, replaceSheetData, isOpen, isCurrent } = useSheet()
  const sheetIdRef = useRef<string | null>(null)

  const { renameSession: renameSessionUnified } = useRenameSession()
  const { deleteSession } = useDeleteSession()
  const { setSession: setSessionId, selectedId } = usePlaygroundQueries()
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchPlaygroundSessions()

  const handleOpenSessions = () => {
    const id = openSheet(
      (data: SessionsSheetData) => (
        <SessionsTab
          sessionsData={data.sessionsData}
          isLoading={data.isLoading}
          fetchNextPage={() => fetchNextPage()}
          hasNextPage={Boolean(data.hasNextPage)}
          isFetchingNextPage={Boolean(data.isFetchingNextPage)}
          onRenameSession={(sessionId: string, newName: string) => {
            renameSessionUnified.mutate({ sessionId, newName })
          }}
          onDeleteSession={(sessionId: string) => {
            deleteSession.mutate({ sessionId })
          }}
          onLoadSession={(sessionId: string) => {
            setSessionId(sessionId)
          }}
        />
      ),
      {
        side: 'right',
        title: 'Sessions',
        id: 'playground-sessions-sheet',
        initialData: {
          sessionsData,
          isLoading: isSessionsLoading,
          hasNextPage: Boolean(hasNextPage),
          isFetchingNextPage: Boolean(isFetchingNextPage)
        }
      }
    )
    sheetIdRef.current = id
  }

  // Mirror upstream data -> sheet (only for *our* sheet instance)
  useEffect(() => {
    if (!sheetIdRef.current) return
    if (!isOpen) return
    if (!isCurrent(sheetIdRef.current)) return

    // Always pass a NEW object reference so React re-renders
    replaceSheetData<SessionsSheetData>({
      sessionsData,
      isLoading: isSessionsLoading,
      hasNextPage: Boolean(hasNextPage),
      isFetchingNextPage: Boolean(isFetchingNextPage)
    })
  }, [
    sessionsData,
    isSessionsLoading,
    hasNextPage,
    isFetchingNextPage,
    isOpen,
    isCurrent,
    replaceSheetData
  ])
  return (
    <Button
      onClick={handleOpenSessions}
      variant="secondary"
      iconPosition="left"
      icon="counter-clockwise-clock"
      className="h-6 py-1"
      disabled={!selectedId}
    >
      Sessions
    </Button>
  )
}

export default ChatSessionsSheet

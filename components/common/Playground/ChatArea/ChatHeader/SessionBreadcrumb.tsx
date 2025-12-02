import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BreadcrumbItem } from '@/components/ui/breadcrumb'
import SessionOptionsDropdown from '@/components/common/Playground/SessionItem/SessionOptionsDropdown'
import SessionItemDeleteModal from '@/components/common/Playground/SessionItem/SessionItemDeleteModal'
import { Input } from '@/components/ui/input'
import { useSheet } from '@/providers/SheetProvider'
import SessionState from '../../RightSidebar/SessionState/SessionState'
import { useSessionDataQuery } from '@/hooks/sessions/useSessionDataQuery'
import { useFilterType } from '@/hooks/useFilterType'
import { formatSessionNameForDisplay } from '@/utils/sessionName'

interface SessionBreadcrumbProps {
  sessionId: string
  sessionName: string
  onRename: (sessionId: string, newName: string) => void
  onDelete: (sessionId: string) => void
  isStreaming: boolean
  messagesLength: number
}

const SessionBreadcrumb = ({
  sessionId,
  sessionName,
  onRename,
  onDelete,
  isStreaming,
  messagesLength
}: SessionBreadcrumbProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { openSheet } = useSheet()
  const { data: sessionData } = useSessionDataQuery(sessionId || null)
  const { isWorkflow } = useFilterType()
  const inputRef = useRef<HTMLInputElement>(null)

  // Typewriter only for agent/team optimistic sessions (skip workflows and regular loads)
  const shouldTypewriter = isStreaming && messagesLength === 1
  const [displayedName, setDisplayedName] = useState(sessionName)
  const typingTimeoutRef = useRef<number | null>(null)

  const formattedDisplayedName = useMemo(
    () => formatSessionNameForDisplay(displayedName),
    [displayedName]
  )

  useEffect(() => {
    // Reset on session switch
    setDisplayedName(formattedDisplayedName)

    if (!shouldTypewriter) return

    setDisplayedName('')

    let index = 0
    const step = () => {
      index += 1
      setDisplayedName(formattedDisplayedName.slice(0, index))
      if (index < formattedDisplayedName.length) {
        typingTimeoutRef.current = window.setTimeout(step, 18)
      }
    }
    step()

    return () => {
      if (typingTimeoutRef.current)
        window.clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [sessionId, sessionName, shouldTypewriter])

  const handleRename = () => {
    if (newTitle.trim() !== '' && newTitle.trim() !== sessionName) {
      onRename(sessionId, newTitle)
    }
    requestAnimationFrame(() => {
      setIsEditing(false)
      setNewTitle('')
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setNewTitle('')
      setIsEditing(false)
    }
  }

  const startEditing = () => {
    setIsEditing(true)
    setNewTitle(sessionName)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleDropdownRename = () => {
    setDropdownOpen(false)
    startEditing()
  }

  const handleOpenSessionState = () => {
    const sessionState = sessionData?.session_state
    // Open using a renderer so content mounts after sheet is visible
    openSheet(() => <SessionState sessionState={sessionState} />, {
      side: 'right',
      title: 'Session State',
      id: 'playground-session-state-sheet'
    })
  }

  return (
    <>
      <BreadcrumbItem
        isDropdownListPresent={false}
        className="group !max-w-none"
      >
        <div className="flex items-center gap-1">
          {isEditing ? (
            <Input
              type="text"
              value={newTitle}
              autoFocus
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              ref={inputRef}
              className="h-fit w-full rounded-none border-none bg-transparent px-2 py-0 text-sm outline-none focus:ring-0"
              placeholder={sessionName}
            />
          ) : (
            <SessionOptionsDropdown
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              onRename={handleDropdownRename}
              onDelete={() => setIsDeleteModalOpen(true)}
              onOpenSessionState={handleOpenSessionState}
              showSessionState={!isWorkflow}
              sessionId={sessionId}
              sessionName={sessionName}
              displayedName={formattedDisplayedName}
            />
          )}
        </div>
      </BreadcrumbItem>

      <SessionItemDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => onDelete(sessionId)}
      />
    </>
  )
}

export default SessionBreadcrumb

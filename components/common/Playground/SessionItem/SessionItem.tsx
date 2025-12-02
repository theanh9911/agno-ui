import { JSX, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import SessionOptionsDropdown from './SessionOptionsDropdown'
import SessionItemDeleteModal from './SessionItemDeleteModal'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import Paragraph from '@/components/ui/typography/Paragraph'
import { formatSessionNameForDisplay } from '@/utils/sessionName'
import Icon from '@/components/ui/icon'

export interface SessionItemProps {
  session_id: string
  sessionName: string
  onRename: (sessionId: string, newTitle: string) => void
  onLoadSession: (sessionId: string) => void
  onDelete: (sessionId: string) => void
  isStreaming?: boolean
}
const SessionItem = ({
  session_id,
  sessionName,
  onRename,
  onLoadSession,
  onDelete,
  isStreaming = false
}: SessionItemProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { session: sessId, selectedId } = usePlaygroundQueries()
  const isActive = sessId === session_id
  const handleRename = () => {
    if (newTitle.trim() !== '' && newTitle.trim() !== sessionName) {
      onRename(session_id, newTitle)
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
  const handleClick = () => {
    if (isActive) return
    if (!isEditing) {
      onLoadSession(session_id)
    }
  }
  const startEditing = () => {
    setIsEditing(true)
    setNewTitle(sessionName)
  }
  const handleDropdownRename = () => {
    setDropdownOpen(false)
    startEditing()
  }
  const displaySessionName = useMemo(
    () => formatSessionNameForDisplay(sessionName),
    [sessionName]
  )
  return (
    <>
      <div
        key={session_id}
        className={`group relative flex h-[3.25rem] flex-row items-center justify-between rounded-md p-3 ${
          isEditing ? 'border-2 border-border-selected' : ''
        } ${isActive ? 'bg-secondary hover:cursor-default' : 'bg-secondary/50'}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick()
          }
        }}
        onClick={handleClick}
      >
        <div className="flex-grow overflow-hidden">
          {isEditing ? (
            <Input
              type="text"
              value={newTitle}
              autoFocus
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              className="w-full rounded-none border-none bg-transparent px-0 py-1 outline-none focus:ring-0"
              placeholder={sessionName}
            />
          ) : (
            <Paragraph className="truncate text-primary" size="body">
              {displaySessionName}
            </Paragraph>
          )}
        </div>
        {!isEditing &&
          (isStreaming ? (
            <div className="shrink-0">
              <Icon type="loader" size="xs" className="animate-spin" />
            </div>
          ) : (
            selectedId && (
              <div
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <SessionOptionsDropdown
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                  onRename={handleDropdownRename}
                  onDelete={() => setIsDeleteModalOpen(true)}
                />
              </div>
            )
          ))}
      </div>
      <SessionItemDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          onDelete(session_id)
          setIsDeleteModalOpen(false)
        }}
      />
    </>
  )
}
export default SessionItem

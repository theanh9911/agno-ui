import { ReactNode, useEffect, useCallback } from 'react'

import { useFetchOSStatus } from '@/hooks/os'
import { ChatHeader } from '@/components/common/Playground/ChatArea/ChatHeader/ChatHeader'
import {
  useAgentsPlaygroundStore,
  useUploadFileStore
} from '@/stores/playground'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import { useFilterType } from '@/hooks/useFilterType'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import DragDrop from '@/components/common/DragDrop'
import Paragraph from '@/components/ui/typography/Paragraph'
import { processAndAddFiles } from '@/utils/playgroundUtils'
import ChatRightChildren from '@/components/common/Playground/ChatArea/ChatRightChildren'
import { ChatInput } from '@/components/common/Playground/ChatArea/ChatInput'

interface PlaygroundLayoutProps {
  children: ReactNode
}

/**
 * Common layout for playground pages (Agents, Teams, Workflows)
 * Features:
 * - Common header with tabs
 * - Optional flexible sidebar on the left
 * - Flexible sidebar on the right
 * - No fixed heights - uses natural scrolling
 * - No margins between header and content area
 */
const PlaygroundLayout = ({ children }: PlaygroundLayoutProps) => {
  const { data: isOsAvailable } = useFetchOSStatus()
  // Use reactive selectors for setMessages functions - these are stable
  const setAgentMessages = useAgentsPlaygroundStore((s) => s.setMessages)
  const setTeamMessages = useTeamsPlaygroundStore((s) => s.setMessages)
  const { isTeam } = useFilterType()
  const { session } = usePlaygroundQueries()
  const { files, addFile } = useUploadFileStore()

  // Clear messages from stores when session becomes undefined to prevent stale messages
  useEffect(() => {
    if (!session) {
      if (isTeam) {
        setTeamMessages([])
      } else {
        setAgentMessages([])
      }
    }
  }, [session, isTeam])

  // Handle files dropped via drag and drop
  const handleFilesDropped = useCallback(
    (droppedFiles: File[]) => {
      processAndAddFiles(droppedFiles, files, addFile)
    },
    [files, addFile]
  )

  // Custom drag overlay content
  const dragOverContent = (
    <div className="flex items-center justify-center">
      <Paragraph size="lead" className="text-primary">
        Drop files to upload them to the chat
      </Paragraph>
    </div>
  )

  const renderContent = () => {
    return (
      <div className="relative flex h-full overflow-hidden">
        {/* Main content area */}
        <DragDrop
          onFilesDropped={handleFilesDropped}
          dragOverContent={dragOverContent}
          className="relative flex min-h-0 flex-1 flex-col"
        >
          <main
            className={`relative flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden`}
          >
            {/* Header */}
            {isOsAvailable && (
              <div className="absolute left-0 right-0 top-0 z-20">
                <ChatHeader />
              </div>
            )}
            {/* Content area - flexible height with its own scroll */}
            <div className="chat-content-area relative min-h-0 flex-1">
              {children}

              {/* Right sidebar injected via ChatRightChildren */}
              <ChatRightChildren />
            </div>
          </main>
          {isOsAvailable && (
            <div className="absolute bottom-0 w-full">
              <ChatInput />
            </div>
          )}
        </DragDrop>
      </div>
    )
  }
  return <>{renderContent()}</>
}

export default PlaygroundLayout

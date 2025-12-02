import Icon from '@/components/ui/icon'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import AgentThinkingLoader from '@/components/common/Playground/MessageAreaWrapper/AgentThinkingLoader'
import { EntityNotFound } from '@/components/common/Playground/BlankStates/EntityNotFound'
import { MessageAreaWrapper } from '../MessageAreaWrapper'
import MessageArea from './MessageArea/MessageArea'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { usePageViewOptions, PageViewState } from '@/hooks/os'
import { useFilterType } from '@/hooks/useFilterType'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import ChatBlankState from '@/components/common/Playground/BlankStates/ChatBlankState'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { useEffect, useMemo, useRef } from 'react'
import ChatTeaserPage from '../BlankStates/ChatTeaserPage'
import OsBlankState from '../../OsBlankState/OsBlankState'
import useFetchPlaygroundSession from '@/hooks/playground/useFetchPlaygroundSession'
import MessageAreaSkeleton from './MessageArea/MessageAreaSkeleton'

const ChatArea = () => {
  const { isTeam } = useFilterType()
  const { data: teams = [], isLoading: isTeamsLoading } = useTeamsQuery()
  const { data: agents = [], isLoading: isAgentsLoading } = useAgentsQuery()
  const { view } = usePageViewOptions()
  const { isLoading: isFetchingPlaygroundSession } = useFetchPlaygroundSession()
  // Use reactive selectors instead of entire store objects to prevent re-renders
  const isAgentsStreaming = useAgentsPlaygroundStore((s) => s.isStreaming)
  const isTeamsStreaming = useTeamsPlaygroundStore((s) => s.isStreaming)
  const agentsMessages = useAgentsPlaygroundStore((s) => s.messages)
  const teamsMessages = useTeamsPlaygroundStore((s) => s.messages)

  const isLoading =
    isTeamsLoading || isAgentsLoading || view === PageViewState.LOADING

  const isStreaming = useMemo(() => {
    return isTeam ? isTeamsStreaming : isAgentsStreaming
  }, [isTeam, isTeamsStreaming, isAgentsStreaming])

  const messages = useMemo(() => {
    if (isTeam) return teamsMessages
    return agentsMessages
  }, [isTeam, agentsMessages, teamsMessages])
  const { session } = usePlaygroundQueries()
  const prevSessionRef = useRef<string | undefined>(undefined)
  const wasStreamingOnLastSessionChangeRef = useRef<boolean>(false)

  useEffect(() => {
    if (prevSessionRef.current !== session) {
      // capture whether we were streaming right before session changed
      wasStreamingOnLastSessionChangeRef.current = isStreaming
      prevSessionRef.current = session
    }
  }, [session, isStreaming])

  const isSwitchingFromStreaming = wasStreamingOnLastSessionChangeRef.current

  const icon = isTeam ? 'team' : 'avatar'
  const styles = isTeam ? 'text-white bg-brand p-1 rounded-[6px]' : ''
  const data = isTeam ? teams : agents
  const showEntityNotFound = data?.length === 0 && !isLoading

  const renderMessages = () => {
    switch (true) {
      case isLoading && !session:
        return (
          <div className="flex h-full flex-col items-center justify-center gap-4 pt-[72px]">
            <Icon type={icon} size="md" className={styles} />
            <AgentThinkingLoader />
          </div>
        )
      case (isFetchingPlaygroundSession && !isSwitchingFromStreaming) ||
        (isLoading && !!session):
        return (
          <div className="mx-auto h-full w-full max-w-[800px] px-6 pt-[72px]">
            <MessageAreaSkeleton />
          </div>
        )

      case (view === PageViewState.DISCONNECTED ||
        view === PageViewState.INACTIVE ||
        view === PageViewState.AUTH_FAILED ||
        view === PageViewState.MISSING_SECURITY_KEY) &&
        !isLoading: {
        if (view) {
          return (
            <>
              <ChatTeaserPage />
              <OsBlankState status={view} />
            </>
          )
        }
        break
      }

      case !!showEntityNotFound:
        return (
          <div className="flex flex-grow items-center justify-center pt-[72px]">
            <EntityNotFound />
          </div>
        )

      case messages.length === 0 && !isLoading:
        return (
          <div className="h-full w-full px-6 pt-[72px]">
            <ChatBlankState />
          </div>
        )
      default:
        return (
          <div className="flex h-full min-h-0 w-full flex-grow">
            <MessageAreaWrapper
              runsLength={messages.length}
              isStreaming={isStreaming}
            >
              <MessageArea conversations={messages} />
            </MessageAreaWrapper>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full min-h-0 flex-grow flex-col">
        {renderMessages()}
      </div>
    </div>
  )
}

export default ChatArea

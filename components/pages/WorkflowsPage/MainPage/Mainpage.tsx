import AgentThinkingLoader from '@/components/common/Playground/MessageAreaWrapper/AgentThinkingLoader'
import { MessageAreaWrapper } from '@/components/common/Playground/MessageAreaWrapper'
import { usePageViewOptions, PageViewState } from '@/hooks/os'
import useWorkflows from '@/hooks/workflows/useWorkflows'
import { Helmet } from 'react-helmet-async'
import Icon from '@/components/ui/icon'
import WorkflowBlankState from '../BlankStates/WorkflowBlankState'
import ChatBlankState from '@/components/common/Playground/BlankStates/ChatBlankState'
import {
  useWorkflowById,
  useWorkflowRunsForSession,
  useWorkflowRunsRealtime
} from '@/hooks/workflows'
import WorkflowChatArea from './WorkflowChatArea/WorkflowChatArea'
import OsBlankState from '@/components/common/OsBlankState/OsBlankState'
import ChatTeaserPage from '@/components/common/Playground/BlankStates/ChatTeaserPage'
import MessageAreaSkeleton from '@/components/common/Playground/ChatArea/MessageArea/MessageAreaSkeleton'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useEffect, useRef } from 'react'

const MainPage = () => {
  const { data: workflows, isLoading: isWorkflowsLoading } = useWorkflows()
  const { view } = usePageViewOptions()
  const { session } = usePlaygroundQueries()
  const { isLoading: isWorkflowLoading } = useWorkflowById()

  // Get session-specific streaming state - use selector that returns stable boolean
  const { isStreaming } = useWorkflowRunsForSession(session)

  // Track whether the previous session was streaming to avoid flashing skeletons
  const prevSessionRef = useRef<string | undefined>(undefined)
  const wasStreamingOnLastSessionChangeRef = useRef<boolean>(false)

  useEffect(() => {
    if (prevSessionRef.current !== session) {
      wasStreamingOnLastSessionChangeRef.current = isStreaming
      prevSessionRef.current = session
    }
  }, [session, isStreaming])

  // Mount realtime hook and get runs so we can pass content from the top
  const { data: workflowRuns = [], isLoading: isRunsLoading } =
    useWorkflowRunsRealtime()

  // Only check loading state if we are content or loading view and not when its inactive.
  const isAnyEndpointLoading =
    view === PageViewState.LOADING ||
    (view === PageViewState.CONTENT &&
      (isWorkflowsLoading || isWorkflowLoading))

  const hasWorkflows = (workflows ?? []).length > 0

  const renderMainContent = () => {
    const isSwitchingFromStreaming = wasStreamingOnLastSessionChangeRef.current
    if (isAnyEndpointLoading && !session) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 pt-[72px]">
          <div className="rounded-sm bg-brand p-2">
            <Icon type="workflow" size="sm" className="text-white" />
          </div>
          <AgentThinkingLoader />
        </div>
      )
    }

    if (
      !isAnyEndpointLoading &&
      (view === PageViewState.DISCONNECTED ||
        view === PageViewState.INACTIVE ||
        view === PageViewState.AUTH_FAILED ||
        view === PageViewState.MISSING_SECURITY_KEY)
    ) {
      if (view) {
        return (
          <>
            <ChatTeaserPage />
            <OsBlankState status={view} />
          </>
        )
      }
    }

    if (
      !hasWorkflows &&
      !isAnyEndpointLoading &&
      view === PageViewState.CONTENT
    ) {
      return <WorkflowBlankState />
    }

    if (
      (isRunsLoading && !isSwitchingFromStreaming) ||
      (isAnyEndpointLoading &&
        !!session &&
        workflowRuns.length === 0 &&
        !isSwitchingFromStreaming)
    ) {
      return (
        <div className="mx-auto h-full w-full max-w-[800px] px-6 pt-[72px]">
          <MessageAreaSkeleton />
        </div>
      )
    }

    // Only show blank state if there are no runs AND we're not streaming
    // If streaming, we might have runs that haven't loaded yet
    if (workflowRuns.length === 0 && !isAnyEndpointLoading && !isStreaming) {
      return (
        <div className="relative mx-6 size-full pt-[72px]">
          <ChatBlankState />
        </div>
      )
    }

    return (
      <MessageAreaWrapper
        runsLength={workflowRuns?.length}
        isStreaming={isStreaming}
      >
        <WorkflowChatArea messages={workflowRuns} session={session} />
      </MessageAreaWrapper>
    )
  }

  return (
    <>
      <Helmet>
        <title>Workflows | Agno App</title>
      </Helmet>
      <div className="flex h-full w-full items-center justify-center">
        {renderMainContent()}
      </div>
    </>
  )
}

export default MainPage

import { toast } from '@/components/ui/toast'
import { useEffect } from 'react'

import {
  usePlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import useAIStreamHandler from '@/hooks/playground/useAIStreamHandler'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'

import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useAgentsPlaygroundStore } from '@/stores/playground'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { useOSStore } from '@/stores/OSStore'

import { useFilterType } from '@/hooks/useFilterType'
import useAgentLoader from '@/hooks/playground/useAgentLoader'
import {
  useWorkflowById,
  useWorkflowLoader,
  useWorkflowRunsForSession,
  useWorkflows
} from '@/hooks/workflows'
import useTeamURLLoader from '@/hooks/playground/useTeamURLLoader'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import ChatInputContainer from './ChatInputContainer'
import { useUploadFileStore } from '@/stores/playground'
import { useWorkflowRun } from '@/hooks/workflows/useWorkflowRun'
import { WorkflowFormData } from '@/schema'

const ChatInput = () => {
  const { isStreaming: isStreamingAgents } = useAgentsPlaygroundStore()
  const { isStreaming: isStreamingTeams } = useTeamsPlaygroundStore()
  const { isTeam, isWorkflow, type } = useFilterType()
  const chatInputRef = usePlaygroundStore((state) => state.chatInputRef)
  const inputMessage = usePlaygroundStore((state) => state.inputMessage)
  const setInputMessage = usePlaygroundStore((state) => state.setInputMessage)

  // Run button no longer exposes an imperative ref; execution handled in parent

  // Get session from playground queries first
  const { selectedId, session } = usePlaygroundQueries()

  const { data: teams = [] } = useTeamsQuery()
  const { data: agents = [] } = useAgentsQuery()
  const { data: workflows } = useWorkflows()
  const { data: workflow } = useWorkflowById()
  const { handleStreamResponse } = useAIStreamHandler()
  const { files } = useUploadFileStore()
  const { runWorkflow } = useWorkflowRun()

  const data = isWorkflow ? workflows : isTeam ? teams : agents

  // Workflow-specific state
  const workflowSchema = workflow?.input_schema
  const { formData, isFormValid } = useWorkflowsStore()
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null

  useAgentLoader()
  useTeamURLLoader()
  useWorkflowLoader()

  // Get session-specific streaming state for workflows - use selector that returns stable boolean
  const { isStreaming: isStreamingWorkflow } =
    useWorkflowRunsForSession(session)
  // Compute unified streaming state across agents, teams, and workflows
  const isStreaming = isWorkflow
    ? isStreamingWorkflow
    : isTeam
      ? isStreamingTeams
      : isStreamingAgents

  // Derive schema for current selection (workflow, team, or agent)
  const selectedItem = (data ?? []).find(
    (item) => 'id' in item && item.id === selectedId
  ) as unknown as { input_schema?: unknown } | undefined
  const inputSchema = isWorkflow ? workflowSchema : selectedItem?.input_schema

  // Clear the input message when selection or OS endpoint changes
  useEffect(() => {
    setInputMessage('')
  }, [selectedId, selectedEndpoint, type])

  const handleSubmit = async () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage && files.length === 0) return

    setInputMessage('')

    try {
      await handleStreamResponse(trimmedMessage)
    } catch (error) {
      toast.error({
        description: `Error in handleSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      })
    }
  }

  const handleWorkflowSubmit = async () => {
    if (isStreaming) return
    // Validate form when schema present
    if (isWorkflow && inputSchema && !isFormValid) {
      document.dispatchEvent(new Event('workflow-validate'))
      return
    }

    try {
      if (isWorkflow && selectedId && typeof selectedId === 'string') {
        const inputData = workflowSchema
          ? (formData as WorkflowFormData)
          : ({ message: inputMessage.trim() } as unknown as WorkflowFormData)

        // Clear input
        setInputMessage('')

        await runWorkflow(
          selectedId,
          inputData,
          (selectedEndpoint as string) || '',
          (workflowSchema as { properties?: Record<string, unknown> }) ||
            undefined
        )
      }
    } catch (error) {
      toast.error({
        description: `Error in handleWorkflowSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      })
    }
  }

  const isDisabled =
    data?.length === 0 ||
    (!inputMessage.trim() && files.length === 0) ||
    isStreaming

  return (
    <ChatInputContainer
      isWorkflow={isWorkflow}
      selectedId={selectedId}
      formData={formData}
      inputSchema={inputSchema}
      isFormValid={isFormValid}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      chatInputRef={chatInputRef}
      isDisabled={isDisabled}
      data={data ?? []}
      isStreaming={isStreaming}
      session={session}
      onSubmit={isWorkflow ? handleWorkflowSubmit : handleSubmit}
    />
  )
}

export default ChatInput

import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useWorkflows } from '@/hooks/workflows'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useUpdateQueries } from '@/hooks/useUpdateQueries'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { useFilterType } from '@/hooks/useFilterType'
import { FilterType } from '@/types/filter'
import { IconType } from '@/components/ui/icon'
import useRenameSession from '@/hooks/sessions/useRenameSession'
import useDeleteSession from '@/hooks/sessions/useDeleteSession'
import { useSessionDataQuery } from '@/hooks/sessions/useSessionDataQuery'
import { CACHE_KEYS } from '@/constants'
import { useOSStore } from '@/stores/OSStore'
import { SessionEntry } from '@/types/playground'

export const useChatHeaderBreadcrumbData = () => {
  const queryClient = useQueryClient()
  const { currentOS } = useOSStore()
  const { updateMultipleQueryParams } = useUpdateQueries()
  const { selectedId, session } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { data: workflows } = useWorkflows()
  const { type, isTeam, isWorkflow } = useFilterType()
  const { renameSession: renameSessionUnified } = useRenameSession()
  const { deleteSession } = useDeleteSession()

  // Use React Query to fetch session data properly
  const { data: sessionData } = useSessionDataQuery(session ?? '')

  // Calculate dbId for cache invalidation
  const dbId = isWorkflow
    ? (workflows?.find((workflow) => workflow.id === selectedId)?.db_id ?? '')
    : isTeam
      ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
      : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')

  const setAgentMessages = useAgentsPlaygroundStore(
    (state) => state.setMessages
  )
  const setTeamMessages = useTeamsPlaygroundStore((state) => state.setMessages)
  const { setHistoryWorkflowRuns } = useWorkflowsStore()
  const agentsStore = useAgentsPlaygroundStore()
  const teamsStore = useTeamsPlaygroundStore()

  // Section selector items
  const selectorItems = [
    { label: 'Agents', value: FilterType.Agents, icon: 'avatar' as IconType },
    {
      label: 'Teams',
      value: FilterType.Teams,
      icon: 'team-orange-bg' as IconType
    },
    {
      label: 'Workflows',
      value: FilterType.Workflows,
      icon: 'workflow-orange-bg' as IconType
    }
  ]

  // Generate options based on current type
  const agentOptions = useMemo(
    () =>
      agents?.map((agent) => ({
        value: agent.id,
        label: agent.name ?? agent.id
      })) || [],
    [agents]
  )

  const teamOptions = useMemo(
    () =>
      teams?.map((team) => ({
        value: team.id,
        label: team.name ?? team.id
      })) || [],
    [teams]
  )

  const workflowOptions = useMemo(
    () =>
      workflows?.map((workflow) => ({
        value: workflow.id,
        label: workflow.name ?? workflow.id
      })) || [],
    [workflows]
  )

  // Get conversations for current section
  const conversations = useMemo(() => {
    if (isTeam) return teamsStore.messages
    return agentsStore.messages
  }, [isTeam, agentsStore.messages, teamsStore.messages])

  const sessionOptions = conversations.map((conv, index) => ({
    value: conv.run_id || `session-${index}`,
    label: `Session ${index + 1}`
  }))

  // Check if we have data for each type
  const hasAgents = agentOptions.length > 0
  const hasTeams = teamOptions.length > 0
  const hasWorkflows = workflowOptions.length > 0

  // Get current component options and selected item based on type
  const { currentOptions, currentSelectedItem, shouldShowAgentBreadcrumb } =
    useMemo(() => {
      switch (type) {
        case 'agent': {
          const selectedAgent = agents?.find((agent) => agent.id === selectedId)
          return {
            currentOptions: agentOptions,
            currentSelectedItem: selectedAgent
              ? {
                  value: selectedAgent.id,
                  label: selectedAgent.name ?? selectedAgent.id
                }
              : { value: '', label: 'Select an agent' },
            shouldShowAgentBreadcrumb: hasAgents
          }
        }
        case 'team': {
          const selectedTeam = teams?.find((team) => team.id === selectedId)
          return {
            currentOptions: teamOptions,
            currentSelectedItem: selectedTeam
              ? {
                  value: selectedTeam.id,
                  label: selectedTeam.name ?? selectedTeam.id
                }
              : { value: '', label: 'Select a team' },
            shouldShowAgentBreadcrumb: hasTeams
          }
        }
        case 'workflow': {
          const selectedWorkflow = workflows?.find(
            (workflow) => workflow.id === selectedId
          )
          return {
            currentOptions: workflowOptions,
            currentSelectedItem: selectedWorkflow
              ? {
                  value: selectedWorkflow.id,
                  label: selectedWorkflow.name ?? selectedWorkflow.id
                }
              : { value: '', label: 'Select a workflow' },
            shouldShowAgentBreadcrumb: hasWorkflows
          }
        }
        default:
          return {
            currentOptions: [],
            currentSelectedItem: { value: '', label: 'Select an item' },
            shouldShowAgentBreadcrumb: false
          }
      }
    }, [
      type,
      selectedId,
      agents,
      teams,
      workflows,
      agentOptions,
      teamOptions,
      workflowOptions,
      hasAgents,
      hasTeams,
      hasWorkflows
    ])

  // Check if we should show sessions breadcrumb
  const shouldShowSessionsBreadcrumb = !!session && !!sessionData

  // Current session info - get actual session name from data
  const currentSessionName = sessionData?.session_name

  // Handlers
  const handleSectionSelect = (value: string) => {
    updateMultipleQueryParams({
      type: value,
      id: null,
      session: null
    })
    setAgentMessages([])
    setTeamMessages([])
    // Clear workflow runs for current session if exists
    if (session && type === 'workflow') {
      setHistoryWorkflowRuns(session, [])
    }
  }

  const handleEntitySelect = (value: string) => {
    updateMultipleQueryParams({ id: value, session: null })
    if (type === 'agent') {
      setAgentMessages([])
    } else if (type === 'team') {
      setTeamMessages([])
    } else if (type === 'workflow' && session) {
      setHistoryWorkflowRuns(session, [])
    }
  }

  const handleSessionSelect = (value: string) => {
    updateMultipleQueryParams({ session: value })
  }

  const handleSessionRename = (sessionId: string, newName: string) => {
    renameSessionUnified.mutate({ sessionId, newName })

    // Optimistically update session name in cache
    queryClient.setQueryData(
      [
        CACHE_KEYS.AGENT_SESSION({
          currentOS: currentOS?.endpoint_url ?? '',
          session_id: sessionId,
          type,
          dbId
        })
      ],
      (oldData: SessionEntry) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          session_name: newName
        }
      }
    )
  }

  const handleSessionDelete = (sessionId: string) => {
    deleteSession.mutate({ sessionId })

    // Remove deleted session from cache
    queryClient.removeQueries({
      queryKey: [
        CACHE_KEYS.AGENT_SESSION({
          currentOS: currentOS?.endpoint_url ?? '',
          session_id: sessionId,
          type,
          dbId
        })
      ]
    })
  }

  return {
    // Section data
    selectorItems,
    type,

    // Component data
    currentOptions,
    currentSelectedItem,

    // Session data
    conversations,
    sessionOptions,
    currentSessionName,
    sessionData,
    session,

    // Visibility flags
    shouldShowAgentBreadcrumb,
    shouldShowSessionsBreadcrumb,

    // Handlers
    handleSectionSelect,
    handleEntitySelect,
    handleSessionSelect,
    handleSessionRename,
    handleSessionDelete
  }
}

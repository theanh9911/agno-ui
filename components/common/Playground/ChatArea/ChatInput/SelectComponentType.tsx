import React, { useMemo } from 'react'
import Icon, { IconType } from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { getProviderIcon } from '@/utils/modelProvider'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useWorkflows } from '@/hooks/workflows'
import { useFilterType } from '@/hooks/useFilterType'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const SelectComponentType = () => {
  const { selectedId, updateMultipleQueryParams } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { type, isTeam, isAgent } = useFilterType()
  const { data: workflows } = useWorkflows()
  const { data: teams } = useTeamsQuery()

  const setAgentMessages = useAgentsPlaygroundStore(
    (state) => state.setMessages
  )
  const agentOptions = useMemo(
    () =>
      agents?.map((agent) => ({
        value: agent.id,
        label: agent.name ?? agent.id,
        model: agent.model
      })),
    [agents]
  )

  const setTeamMessages = useTeamsPlaygroundStore((state) => state.setMessages)

  const teamOptions = useMemo(
    () =>
      teams?.map((team) => ({
        value: team.id,
        label: team.name ?? team.id,
        model: team.model,
        mode: team.mode
      })),
    [teams]
  )

  const workflowOptions = useMemo(
    () =>
      workflows?.map((workflow) => ({
        value: workflow.id,
        label: workflow.name ?? workflow.id
      })),
    [workflows]
  )

  const componentProps = useMemo(() => {
    switch (type) {
      case 'agent':
        return {
          options: agentOptions,
          placeholder:
            agentOptions && agentOptions?.length > 0
              ? 'Select an agent'
              : 'No agents available'
        }
      case 'team':
        return {
          options: teamOptions,
          placeholder:
            teamOptions && teamOptions?.length > 0
              ? 'Select a team'
              : 'No teams available'
        }
      case 'workflow':
        return {
          options: workflowOptions,
          placeholder:
            workflowOptions && workflowOptions?.length > 0
              ? 'Select a workflow'
              : 'No workflows available'
        }
      default:
        return null
    }
  }, [
    type,
    agentOptions,
    teamOptions,
    workflowOptions,
    updateMultipleQueryParams,
    setAgentMessages,
    setTeamMessages
  ])

  if (!componentProps) {
    return null
  }

  const selectedOption = componentProps.options?.find(
    (o) => o.value === selectedId
  )

  // For teams, derive icon/mode from the underlying team data to satisfy typing
  const selectedTeam = isTeam
    ? teams?.find((team) => team.id === selectedId)
    : undefined

  const selectedAgent = isAgent
    ? agents?.find((agent) => agent.id === selectedId)
    : undefined

  const providerIcon: IconType | null = (() => {
    if (isTeam && selectedTeam?.model) {
      return (
        getProviderIcon(selectedTeam.model.provider) ||
        getProviderIcon(selectedTeam.model.model) ||
        null
      )
    }
    if (isAgent && selectedAgent?.model) {
      return (
        getProviderIcon(selectedAgent.model.provider) ||
        getProviderIcon(selectedAgent.model.model) ||
        null
      )
    }
    return null
  })()

  const providerName = isTeam
    ? selectedTeam?.model?.provider
    : isAgent
      ? selectedAgent?.model?.provider
      : undefined
  const modelName = isTeam
    ? selectedTeam?.model?.model
    : isAgent
      ? selectedAgent?.model?.model
      : undefined
  const providerLabel = [providerName, modelName].filter(Boolean).join(' - ')

  return (
    <div className="flex h-8 w-full max-w-[300px] cursor-default items-center justify-between gap-2 px-3">
      <div className="flex min-w-0 items-center gap-x-1 truncate">
        {selectedOption?.label ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Paragraph size="mono" className="truncate uppercase">
                  {selectedOption.label}
                </Paragraph>
              </TooltipTrigger>
              <TooltipContent className="mx-2">
                {selectedOption.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Paragraph size="mono" className="truncate uppercase">
            {componentProps.placeholder}
          </Paragraph>
        )}
      </div>
      {isTeam && selectedTeam?.mode && (
        <Badge variant="secondary">{selectedTeam.mode}</Badge>
      )}

      {providerIcon && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-[6px] border border-border p-[2.67px]">
                <Icon type={providerIcon} className="h-[10.67px] w-[10.67px]" />
              </div>
            </TooltipTrigger>
            {providerLabel ? (
              <TooltipContent className="mx-2">{providerLabel}</TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

export default SelectComponentType

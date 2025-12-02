import React from 'react'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import {
  TeamNotFoundIcon,
  AgentNotFoundIcon,
  WorkflowBlankStateVisual
} from '@/components/ui/icon/custom-icons'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useFilterType } from '@/hooks/useFilterType'

const SessionsBlankState = () => {
  const { isTeam, isWorkflow } = useFilterType()
  const { selectedId } = usePlaygroundQueries()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()

  const dbId = isTeam
    ? (teams?.find((team) => team.id === selectedId)?.db_id ?? '')
    : (agents?.find((agent) => agent.id === selectedId)?.db_id ?? '')

  const blankStateMessage = (() => {
    switch (true) {
      case !isTeam && !isWorkflow && (!agents || agents.length === 0):
        return 'No agents found'
      case isTeam && (!teams || teams.length === 0):
        return 'No teams found'
      case !dbId:
        return 'No database found'
      default:
        return 'No session found'
    }
  })()

  const SessionsBlankStateIcon = isWorkflow
    ? WorkflowBlankStateVisual
    : isTeam
      ? TeamNotFoundIcon
      : AgentNotFoundIcon
  const errorMessage = (() => {
    switch (true) {
      case !selectedId:
        return `Select ${isTeam ? 'a team' : 'an agent'} to see the sessions.`
      case !dbId:
        return 'Set a database to see the sessions.'
      default:
        return 'No session records yet. Start a conversation to create one.'
    }
  })()
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg bg-secondary/50 py-12">
      <div className="flex flex-col items-center gap-6">
        <SessionsBlankStateIcon />
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-medium text-primary">
            {blankStateMessage}
          </h3>
          <p className="max-w-[220px] text-center text-sm text-muted">
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
export default SessionsBlankState

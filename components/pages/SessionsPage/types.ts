import { AgentSessionDataWithTeamAndWorkflow } from '@/types/Agent'
import type { RunResponseContent } from '@/types/Agent'
import { ReactNode } from 'react'

export interface SessionsProps {
  children?: ReactNode
}

export interface SessionDetailsProps {
  noSelectedPage?: boolean
  agent?: string
  isTeam?: boolean
  isTeamMember?: boolean
  isMember?: boolean
}

export interface SessionDetails {
  agent_details: AgentSessionDataWithTeamAndWorkflow
  agent_id: string
  agent_name?: string
}

export interface SessionProps {
  runs: RunResponseContent[]
  details?: SessionDetails[]
  isTeam: boolean
  id?: string
}

export enum Tab {
  Run = 'Run',
  Details = 'Details',
  Summary = 'Summary',
  Metrics = 'Metrics',
  Agents = 'Agents',
  Team = 'Team'
}

export enum FormatType {
  Formatted = 'formatted',
  Text = 'Text'
}

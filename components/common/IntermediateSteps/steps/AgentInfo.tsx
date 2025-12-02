import { ReactNode } from 'react'
import { IntermediateStep } from '@/types/playground'
import { getAgentInfo } from '../utils'

interface AgentInfoProps {
  step: IntermediateStep
  isTeam: boolean
  className?: string
  children: ReactNode
}

const AgentInfo = ({
  step,
  isTeam,
  className = 'flex items-center gap-2',
  children
}: AgentInfoProps) => {
  const agentId = isTeam ? getAgentInfo(step) : null

  return (
    <div className={className}>
      {agentId && <span className="text-sm text-muted">{agentId}:</span>}
      {children}
    </div>
  )
}

export default AgentInfo

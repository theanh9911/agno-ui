import React from 'react'
import type { AgentDetails, TeamDetails } from '@/types/os'
import AgentTeamConfigView from './AgentTeamConfigView'
import WorkflowConfigView from './WorkflowConfigView'
import { WorkflowDetails } from '@/types/workflow'
import { isWorkflow } from '@/utils/os'

type ConfigViewProps = {
  data?: AgentDetails | TeamDetails | WorkflowDetails
}

const ConfigView = ({ data }: ConfigViewProps) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-y-6">
      {isWorkflow(data) ? (
        <WorkflowConfigView data={data} />
      ) : (
        <AgentTeamConfigView data={data} />
      )}
    </div>
  )
}

export default ConfigView

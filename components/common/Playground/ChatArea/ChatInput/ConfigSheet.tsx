import ConfigView from '@/components/common/ConfigView'
import { Button } from '@/components/ui/button'
import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useFilterType } from '@/hooks/useFilterType'
import { useWorkflowById } from '@/hooks/workflows'
import { useSheet } from '@/providers/SheetProvider'
import { FilterType } from '@/types/filter'
import { TeamDetails } from '@/types/os'
import React from 'react'

const ConfigSheet = () => {
  const { openSheet } = useSheet()
  const { data: workflowData } = useWorkflowById()
  const { data: agents } = useAgentsQuery()
  const { data: teams } = useTeamsQuery()
  const { selectedId } = usePlaygroundQueries()
  const { type } = useFilterType()
  const selectedData = (() => {
    switch (type) {
      case FilterType.Agents:
        return agents?.find((agent) => agent.id === selectedId)
      case FilterType.Teams:
        return teams?.find((team: TeamDetails) => team.id === selectedId)
      case FilterType.Workflows:
        return workflowData
      default:
        return agents?.find((agent) => agent.id === selectedId)
    }
  })()

  const handleConfigClick = () => {
    openSheet(<ConfigView data={selectedData} />, {
      side: 'right',
      title: `${type === FilterType.Agents ? 'Agent' : type === FilterType.Teams ? 'Team' : 'Workflow'} Configuration`
    })
  }
  return (
    <Button
      variant="secondary"
      className="h-6 w-fit shrink-0 uppercase"
      onClick={handleConfigClick}
      disabled={!selectedData}
    >
      See Config
    </Button>
  )
}

export default ConfigSheet

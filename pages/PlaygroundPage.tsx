import AgentsPlaygroundPage from '@/components/pages/AgentsPlaygroundPage'
import TeamsPlaygroundPage from '@/components/pages/TeamsPlaygroundPage'
import WorkflowsPage from '@/components/pages/WorkflowsPage'
import { useFilterType } from '@/hooks/useFilterType'

export default function PlaygroundPage() {
  const { isTeam, isWorkflow } = useFilterType()

  // Render the appropriate component based on the type query parameter
  if (isTeam) {
    return <TeamsPlaygroundPage />
  }

  if (isWorkflow) {
    return <WorkflowsPage />
  }

  // Default to agents
  return <AgentsPlaygroundPage />
}

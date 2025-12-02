import { useAgentsQuery } from '@/hooks/playground/useAgentsQuery'
import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { DOC_LINKS } from '@/docs'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useMemo } from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os/useFetchOSStatus'
import { useFilterType } from '@/hooks/useFilterType'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

export const EntityNotFound = () => {
  const { selectedId } = usePlaygroundQueries()
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { data: isOsAvailable } = useFetchOSStatus()
  const { isTeam } = useFilterType()
  const agentsData = useAgentsQuery()
  const teamsData = useTeamsQuery()
  const data = isTeam ? (teamsData?.data ?? []) : (agentsData?.data ?? [])
  const itemName = isTeam ? 'team' : 'agent'

  const blankStateData = useMemo(() => {
    const noEntitySelected = isOsAvailable && data?.length > 0 && !selectedId

    const noItemsFound = isOsAvailable && data?.length === 0

    if (noEntitySelected) {
      return {
        title: `Select a ${itemName} to continue`,
        description: `Choose a ${itemName} to get started or visit our docs to learn more.`,
        docLink: isTeam
          ? DOC_LINKS.platform.teams.introduction
          : DOC_LINKS.platform.agents.introduction
        // buttonText: `demo ${itemName}`,
        // buttonIcon: 'run' as const,
        // buttonOnClick: () =>
        //   setSelectedEndpoint(parseUrl(PLAYGROUND_DEMO_AGENT_URL))
      }
    }

    if (noItemsFound) {
      return {
        title: `No ${itemName}s found`,
        description: `Please create a ${itemName} to get started or visit our docs to learn more.`,
        docLink: isTeam
          ? DOC_LINKS.platform.teams.introduction
          : DOC_LINKS.platform.agents.introduction
      }
    }

    return null
  }, [selectedEndpoint, isOsAvailable, data, isTeam, selectedId, itemName])

  if (!blankStateData) {
    return null
  }

  return (
    <div className="flex size-full flex-grow flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2">
        <Icon
          type={isTeam ? 'team-blank-state-visual' : 'agent-blank-state-visual'}
          size={90}
          className="text-primary"
        />
        <Paragraph size="lead" className="text-primary">
          {blankStateData.title}
        </Paragraph>
        <Paragraph size="body" className="text-center text-muted">
          {blankStateData.description}
        </Paragraph>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="default"
          icon="external-link"
          onClick={() => window.open(blankStateData.docLink, '_blank')}
        >
          Docs
        </Button>
      </div>
    </div>
  )
}

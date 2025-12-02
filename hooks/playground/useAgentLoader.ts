import { useEffect } from 'react'

import { useAgentsPlaygroundStore } from '@/stores/playground'

import { useAgentsQuery } from './useAgentsQuery'

import { usePlaygroundQueries } from './usePlaygroundQueries'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '../os'
import { useFilterType } from '@/hooks/useFilterType'

const useAgentLoader = () => {
  const setMessages = useAgentsPlaygroundStore((s) => s.setMessages)
  const { setSelectedId, selectedId, updateMultipleQueryParams } =
    usePlaygroundQueries()

  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { type, isAgent } = useFilterType({ autoSetDefault: false })

  const { isPending: isEndpointStatusPending, data: isOsAvailable } =
    useFetchOSStatus()

  const {
    data: agents = [],
    isLoading: agentsIsLoading,
    isFetching: agentsIsFetching
  } = useAgentsQuery() // Fetch agents for the selected endpoint d

  useEffect(() => {
    const updateStates = async () => {
      if (
        !isAgent ||
        isEndpointStatusPending ||
        agentsIsLoading ||
        agentsIsFetching ||
        !type ||
        isOsAvailable === undefined ||
        isOsAvailable === false
      ) {
        return
      }
      // Handle case when no endpoint is selected
      if (!selectedEndpoint) {
        setMessages([])
        updateMultipleQueryParams({ session: null, id: null })
        return
      }

      if (selectedId) {
        const matchedAgent = agents?.find((agent) => agent.id === selectedId)
        if (!matchedAgent) {
          updateMultipleQueryParams({
            session: null,
            id: agents?.length > 0 ? agents[0].id : null
          })
          setMessages([])
          return
        }
      }

      // If no agent is selected but agents are available, select the first agent
      if (!selectedId && agents.length > 0 && isAgent) {
        setSelectedId(agents[0].id)
      }
    }

    updateStates()
  }, [selectedEndpoint, type, agentsIsLoading, agentsIsFetching, agents])

  return {
    agents
  }
}

export default useAgentLoader

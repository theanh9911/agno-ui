import { useEffect } from 'react'
import { useTeamsPlaygroundStore } from '@/stores/playground'

import { usePlaygroundQueries } from './usePlaygroundQueries'
import { useTeamsQuery } from './useTeamsQuery'
import { usePathname } from '@/utils/navigation'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '../os'
import { useFilterType } from '@/hooks/useFilterType'

const useTeamURLLoader = () => {
  const pathname = usePathname()
  const setMessages = useTeamsPlaygroundStore((s) => s.setMessages)
  const { currentOS } = useOSStore()

  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { selectedId, setSelectedId, updateMultipleQueryParams } =
    usePlaygroundQueries()
  const { type, isTeam } = useFilterType({ autoSetDefault: false })

  const { isPending: isEndpointStatusPending, data: isOsAvailable } =
    useFetchOSStatus()

  const {
    data: teams = [],
    isLoading: teamsIsLoading,
    isFetching: teamsIsFetching
  } = useTeamsQuery()

  useEffect(() => {
    const updateStates = async () => {
      if (
        !isTeam ||
        isEndpointStatusPending ||
        teamsIsLoading ||
        teamsIsFetching ||
        !type ||
        !isTeam ||
        isOsAvailable === false
      ) {
        return
      }

      if (!selectedEndpoint) {
        setMessages([])
        updateMultipleQueryParams({ session: null, id: null })
        return
      }

      if (selectedId) {
        const matchedTeam = teams?.find((team) => team.id === selectedId)
        if (!matchedTeam) {
          updateMultipleQueryParams({
            session: null,
            id: teams?.length > 0 ? teams[0].id : null
          })
          setMessages([])
          return
        }
      }

      if (!selectedId && teams.length > 0 && isTeam) {
        setSelectedId(teams[0].id)
      }
    }

    updateStates()
  }, [selectedEndpoint, teams, pathname, teamsIsLoading, teamsIsFetching, type])
  return {
    teams
  }
}

export default useTeamURLLoader

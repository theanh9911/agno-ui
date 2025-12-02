import { getAgentRunsAPI } from '@/api/agent'
import { useFilterType } from '@/hooks/useFilterType'
import { buildRunTree } from '@/components/pages/SessionsPage/SessionsDetails/Session/Tabs/RunsTab/utils'
import { CACHE_KEYS } from '@/constants'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useOSStore } from '@/stores/OSStore'
import { RunResponseContent } from '@/types/Agent'
import { BaseDefaultPageParams } from '@/types/globals'
import { useParams } from '@/utils/navigation'
import { useQuery } from '@tanstack/react-query'

export const useRunsQuery = () => {
  const params = useParams<BaseDefaultPageParams>()
  const currentOS = useOSStore((state) => state.currentOS)
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.session?.db?.db_id || ''
  const table = selectedDatabase.session?.table || ''
  const { type, isTeam } = useFilterType({ autoSetDefault: false })

  const session_id = params.id

  const requestPayload = {
    session_id: session_id,
    type: type
  }

  return useQuery({
    queryKey: [
      CACHE_KEYS.AGENT_RUNS({
        currentOS: currentOS?.endpoint_url ?? '',
        session_id: session_id,
        type: type,
        dbId,
        table
      })
    ],
    queryFn: async () => {
      const response = await getAgentRunsAPI(
        currentOS!.endpoint_url!,
        dbId,
        requestPayload,
        table
      )
      const runs = response.body as RunResponseContent[]
      if (isTeam) {
        return buildRunTree(runs)
      }
      return runs
    },
    enabled: !!params.id && !!currentOS && !!dbId && !!currentOS.endpoint_url,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}

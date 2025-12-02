import { BaseDefaultPageParams } from '@/types/globals'
import { useOSStore } from '@/stores/OSStore'
import { getSessionAPI } from '@/api/agent'
import { CACHE_KEYS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@/utils/navigation'
import { useFilterType } from '@/hooks/useFilterType'
import { useDatabase } from '@/providers/DatabaseProvider'

export const useSessionByIdQuery = () => {
  const params = useParams<BaseDefaultPageParams>()
  const currentOS = useOSStore((state) => state.currentOS)
  const { selectedDatabase } = useDatabase()
  const dbId = selectedDatabase?.session?.db?.db_id || ''
  const table = selectedDatabase.session?.table || ''

  const { type } = useFilterType({ autoSetDefault: false })

  const session_id = params.id

  const requestPayload = {
    session_id: session_id,
    type: type
  }

  return useQuery({
    queryKey: [
      CACHE_KEYS.AGENT_SESSION({
        currentOS: currentOS?.endpoint_url ?? '',
        session_id: session_id,
        type: type,
        dbId,
        table
      })
    ],
    queryFn: async () => {
      const response = await getSessionAPI(
        currentOS!.endpoint_url!,
        dbId,
        requestPayload,
        table
      )
      return response.body
    },
    enabled: !!params.id && !!currentOS && !!dbId && !!currentOS.endpoint_url,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}

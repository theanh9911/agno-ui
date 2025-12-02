import { RefetchType } from '@/types/globals'
import { useQueryClient } from '@tanstack/react-query'
import { isArray } from 'lodash'

type QueryKeyType = (string | null | undefined)[] | string | null | undefined

interface InvalidateQueryConfig {
  queryKey: QueryKeyType
  refetchType?: RefetchType
  exact?: boolean
}

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient()

  const invalidateQuery = async (
    input: InvalidateQueryConfig | InvalidateQueryConfig[]
  ) => {
    const configs: InvalidateQueryConfig[] = Array.isArray(input)
      ? input
      : [input]

    const promises = configs.map(async (config) => {
      const { queryKey, refetchType = 'active', exact = true } = config

      if (!queryKey) return

      const keyArray = isArray(queryKey) ? queryKey : [queryKey]

      await queryClient.invalidateQueries({
        queryKey: keyArray,
        refetchType,
        exact
      })
    })

    await Promise.all(promises)
  }

  return { invalidateQuery }
}

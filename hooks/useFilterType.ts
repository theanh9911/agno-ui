import { useEffect } from 'react'
import { useSearchParams } from '@/utils/navigation'
import { FilterType } from '@/types/filter'
import { useUpdateQueries } from '@/hooks/useUpdateQueries'

interface UseFilterTypeOptions {
  /**
   * Whether to automatically set a default type when no valid type is provided
   * @default true
   */
  autoSetDefault?: boolean
}

/**
 * Hook to get the current filter type from URL search params.
 * @param options Configuration options for the hook
 * @returns The current filter type and boolean flags for type checking
 */
export function useFilterType(options: UseFilterTypeOptions = {}) {
  const { autoSetDefault = true } = options
  const searchParams = useSearchParams()
  const { updateQueryParam } = useUpdateQueries()
  const type = searchParams?.get('type') as FilterType
  const validTypes = Object.values(FilterType)
  const isValidType = validTypes.includes(type as FilterType)

  // Move side effect to useEffect to avoid updating during render
  useEffect(() => {
    if (!isValidType && autoSetDefault) {
      updateQueryParam('type', FilterType.Agents)
    }
  }, [isValidType, autoSetDefault, updateQueryParam])

  const isTeam = type === FilterType.Teams
  const isWorkflow = type === FilterType.Workflows
  const isAgent = type === FilterType.Agents

  return { type, isTeam, isWorkflow, isAgent }
}

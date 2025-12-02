import { useSearchParams } from '@/utils/navigation'

export function useSortBy() {
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort_by')

  // Get sort by and sort order from sortBy query state
  // Example: sortBy = 'last_updated_desc'
  // getSortBy = 'last_updated'
  // getSortOrder = 'desc'

  let getSortBy: string | undefined = undefined
  let getSortOrder: string | undefined = undefined

  if (typeof sortBy === 'string') {
    const lastUnderscoreIndex = sortBy.lastIndexOf('_')
    if (lastUnderscoreIndex !== -1) {
      getSortBy = sortBy.substring(0, lastUnderscoreIndex)
      getSortOrder = sortBy.substring(lastUnderscoreIndex + 1)
    }
  }

  return { sortBy, getSortBy, getSortOrder }
}

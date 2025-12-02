import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useUpdateQueries() {
  const [, setSearchParams] = useSearchParams()

  // Helper function to update a single query parameter
  const updateQueryParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          if (value === null || value === undefined) {
            newParams.delete(key)
          } else {
            newParams.set(key, value)
          }
          return newParams
        },
        { replace: false }
      ) // Ensure we're pushing to history, not replacing
    },
    [setSearchParams]
  )

  // Helper function to update multiple query parameters at once
  const updateMultipleQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined) {
              newParams.delete(key)
            } else {
              newParams.set(key, value)
            }
          })
          return newParams
        },
        { replace: false }
      )
    },
    [setSearchParams]
  )

  return { updateQueryParam, updateMultipleQueryParams }
}

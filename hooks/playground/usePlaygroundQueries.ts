import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useWorkflowsStore } from '@/stores/workflowsStore'

export function usePlaygroundQueries() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get session streaming state management and form data clearing from workflows store
  const { setSessionStreamingState, setFormData } = useWorkflowsStore()

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

  // Get current values
  const type = searchParams.get('type') || 'agent'
  const selectedId = searchParams.get('id') || undefined
  const session = searchParams.get('session') || undefined

  // Unified setter for selected chat ID
  const setSelectedId = useCallback(
    (value: string | null) => {
      updateQueryParam('id', value)
    },
    [updateQueryParam]
  )

  // Setter for type
  const setType = useCallback(
    (value: 'agent' | 'team' | 'workflow') => {
      updateQueryParam('type', value)
    },
    [updateQueryParam]
  )

  // Custom setSession that preserves streaming state when switching sessions
  const setSession = useCallback(
    (newSession: string | null) => {
      // Clear form data when session changes to ensure fresh form state
      setFormData({})

      // Set the new session
      updateQueryParam('session', newSession)
    },
    [session, updateQueryParam, setSessionStreamingState, setFormData]
  )

  return {
    // Main interface
    type,
    setType,
    selectedId,
    setSelectedId,
    session,
    setSession,

    // Utility functions
    updateQueryParam,
    updateMultipleQueryParams
  }
}

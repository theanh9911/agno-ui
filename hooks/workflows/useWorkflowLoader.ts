import { useEffect } from 'react'

import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '../os'
import { useFilterType } from '../useFilterType'
import { useWorkflows } from './useWorkflows'

const useWorkflowLoader = () => {
  const { setSelectedId, selectedId, updateMultipleQueryParams } =
    usePlaygroundQueries()

  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { type, isWorkflow } = useFilterType()

  const { isPending: isEndpointStatusPending, data: isOsAvailable } =
    useFetchOSStatus()

  const {
    data: workflows = [],
    isLoading: workflowsIsLoading,
    isFetching: workflowsIsFetching
  } = useWorkflows()

  useEffect(() => {
    const updateStates = async () => {
      if (
        !isWorkflow ||
        isEndpointStatusPending ||
        workflowsIsLoading ||
        workflowsIsFetching ||
        !type ||
        isOsAvailable === undefined ||
        isOsAvailable === false
      ) {
        return
      }

      // Handle case when no endpoint is selected
      if (!selectedEndpoint) {
        updateMultipleQueryParams({ session: null, id: null })
        return
      }

      if (selectedId) {
        const matchedWorkflow = workflows?.find((w) => w.id === selectedId)
        if (!matchedWorkflow) {
          const newId = workflows?.length > 0 ? workflows[0].id : null
          updateMultipleQueryParams({
            session: null,
            id: newId
          })

          return
        }
      }

      // If no workflow is selected but workflows are available, select the first
      if (!selectedId && workflows.length > 0 && isWorkflow) {
        const first = workflows[0]
        setSelectedId(first.id)
      }
    }

    updateStates()
  }, [
    selectedEndpoint,
    type,
    workflowsIsLoading,
    workflowsIsFetching,
    workflows,
    setSelectedId,
    isWorkflow,
    isEndpointStatusPending,
    isOsAvailable,
    updateMultipleQueryParams
  ])

  return {
    workflows
  }
}

export default useWorkflowLoader

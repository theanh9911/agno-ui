import { useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from '@/utils/navigation'
import { useEvalsRunsQuery } from '@/hooks/evals/useEvalsQuery'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import { useEvaluationSelection } from '@/components/pages/EvaluationPage/hooks/useEvaluationSelection'
import { useEvaluationDelete } from '@/components/pages/EvaluationPage/hooks/useEvaluationDelete'
import { useEvaluationEdit } from '@/components/pages/EvaluationPage/hooks/useEvaluationEdit'
import { SortBy } from '@/types/filter'
import { useSortBy } from '@/hooks'

export const useEvaluation = () => {
  const router = useRouter()
  const { id } = useParams()
  const searchParams = useSearchParams()
  const { sortBy: sortByVal } = useSortBy()

  const componentType = searchParams.get('type') || 'all'
  const sortBy = sortByVal || SortBy.UPDATED_AT_DESC
  const viewFilters = searchParams.get('view_filters') || ''

  const urlSortBy = sortBy
  const urlComponentType = componentType
  const urlViewFilters = viewFilters

  // Global state
  const {
    page,
    limit,
    totalPages,
    totalCount,
    setPage,
    setActiveEvaluation,
    activeEvaluation,
    selectedEvaluations,
    setSelectedEvaluations,
    pendingEvaluations
  } = useEvaluationStore()

  // Query parameters string
  const queryParam =
    `?type=${urlComponentType}` +
    (urlSortBy ? `&sort_by=${urlSortBy}` : '') +
    (urlViewFilters ? `&view_filters=${urlViewFilters}` : '')

  // Data fetching
  const { data, isLoading, error } = useEvalsRunsQuery()

  const evals = data?.data

  const filteredPendingEvaluations = useMemo(() => {
    if (urlComponentType === 'all') {
      return pendingEvaluations
    }

    return pendingEvaluations.filter((pendingEval) => {
      if (urlComponentType === 'agents') {
        return !!pendingEval.agent_id
      }
      if (urlComponentType === 'teams') {
        return !!pendingEval.team_id
      }
      return true
    })
  }, [pendingEvaluations, urlComponentType])

  // Operations hooks
  const Selection = useEvaluationSelection({
    evaluations: evals || [],
    selectedEvaluations,
    onSelectionChange: setSelectedEvaluations
  })

  const deleteOperations = useEvaluationDelete({
    selectedEvaluations,
    onDeleteSuccess: (deletedIds) => {
      // Clear the deleted evaluation from selected evaluations
      const updatedSelectedEvaluations = new Set(selectedEvaluations)
      deletedIds.forEach((id) => updatedSelectedEvaluations.delete(id))
      setSelectedEvaluations(updatedSelectedEvaluations)

      // Calculate remaining evaluations after deletion
      const remainingEvals = evals?.filter(
        (evaluation) => !deletedIds.includes(evaluation.id)
      )

      // If no evaluations remain on current page or none remain at all, go to page 1
      if (!remainingEvals || remainingEvals.length === 0) {
        if (page && page > 1) {
          setPage(1)
        }
        // Don't override preserved URL - let route state system handle it
      } else {
        // If the deleted evaluation was the active one, set the first available one
        if (activeEvaluation && deletedIds.includes(activeEvaluation.id)) {
          setActiveEvaluation(remainingEvals[0])
          // Don't override preserved URL - let route state system handle it
        }
      }
    },
    onBulkDeleteSuccess: () => {
      // Clear selection after successful deletion
      setSelectedEvaluations(new Set())

      // Calculate remaining evaluations after deletion
      const remainingEvals = evals?.filter(
        (evaluation) => !selectedEvaluations.has(evaluation.id)
      )

      // If no evaluations remain on current page or none remain at all, go to page 1
      if (!remainingEvals || remainingEvals.length === 0) {
        if (page && page > 1) {
          setPage(1)
        }
        // Don't override preserved URL - let route state system handle it
      } else {
        // If the active evaluation was deleted, set the first available one
        if (activeEvaluation && selectedEvaluations.has(activeEvaluation.id)) {
          setActiveEvaluation(remainingEvals[0])
          // Don't override preserved URL - let route state system handle it
        }
      }
    }
  })

  const editOperations = useEvaluationEdit()

  // Navigation and active evaluation management - simplified to not override preserved state
  useEffect(() => {
    if (!evals || evals.length === 0 || isLoading) return

    // Only set active evaluation if we don't have one
    if (id) {
      const selectedEval = evals.find((evaluation) => evaluation.id === id)
      if (selectedEval) {
        setActiveEvaluation(selectedEval)
      } else if (evals.length > 0) {
        setActiveEvaluation(evals[0])
      }
    } else if (evals.length > 0) {
      setActiveEvaluation(evals[0])
      // Automatically navigate to the first evaluation when no ID is present
      handleEvaluationClick(evals[0].id)
    }
  }, [evals, id, isLoading])

  // Pagination handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    if (!evals || evals.length === 0) {
      // Don't override preserved URL - let route state system handle it
      return
    } else {
      setActiveEvaluation(evals[0])
      // Don't override preserved URL - let route state system handle it
    }
  }

  // Selection handler
  const handleCancelSelection = () => {
    setSelectedEvaluations(new Set())
  }

  // Navigation handler
  const handleEvaluationClick = (evaluationId: string) => {
    // Navigate to the selected evaluation while preserving current search parameters
    const currentSearch = searchParams.toString()
    const newUrl = `/evaluation/${evaluationId}${currentSearch ? '?' + currentSearch : ''}`
    router.push(newUrl)
  }

  return {
    // Data
    evals,
    isLoading,
    error,
    activeEvaluation,
    selectedEvaluations,
    pendingEvaluations: filteredPendingEvaluations,

    // Pagination
    page,
    limit,
    totalPages,
    totalCount,

    // Operations
    Selection,
    deleteOperations,
    editOperations,

    // Handlers
    handlePageChange,
    handleCancelSelection,
    handleEvaluationClick,

    // Query params
    queryParam
  }
}

import { useMemo } from 'react'
import { EvalRunData } from '@/types/evals'

interface EvaluationSelectionProps {
  evaluations: EvalRunData[]
  selectedEvaluations: Set<string>
  onSelectionChange: (selected: Set<string>) => void
}

export const useEvaluationSelection = ({
  evaluations,
  selectedEvaluations,
  onSelectionChange
}: EvaluationSelectionProps) => {
  // Check if all evaluations are selected
  const isAllSelected = useMemo(() => {
    return (
      evaluations &&
      evaluations?.length > 0 &&
      evaluations?.every((evaluation) =>
        selectedEvaluations?.has(evaluation?.id)
      )
    )
  }, [evaluations, selectedEvaluations])

  // Check if some evaluations are selected, and make header checkbox indeterminate
  const isIndeterminate = useMemo(() => {
    return selectedEvaluations?.size > 0 && !isAllSelected
  }, [selectedEvaluations?.size, isAllSelected])

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(
        new Set(evaluations?.map((evaluation) => evaluation?.id) || [])
      )
    }
  }

  // Select or deselect an evaluation
  const handleSelectRow = (evaluationId: string) => {
    const newSelected = new Set(selectedEvaluations)
    if (newSelected?.has(evaluationId)) {
      newSelected?.delete(evaluationId)
    } else {
      newSelected?.add(evaluationId)
    }
    onSelectionChange(newSelected)
  }

  return {
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleSelectRow
  }
}

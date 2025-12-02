import React, { useState } from 'react'
import { useUpdateEvalsQuery } from '@/hooks/evals/useUpdateEvalsQuery'

export const useEvaluationEdit = () => {
  const updateEvalsMutation = useUpdateEvalsQuery()
  const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(
    null
  )

  const handleEditEvaluation = (evaluationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEvaluationId(evaluationId)
  }

  const handleSaveEvaluation = (evaluationId: string, newName: string) => {
    updateEvalsMutation.mutate({
      eval_run_id: evaluationId,
      eval_run_name: newName
    })
    setEditingEvaluationId(null)
  }

  const handleCancelEdit = () => {
    setEditingEvaluationId(null)
  }

  return {
    updateEvalsMutation,
    editingEvaluationId,
    handleEditEvaluation,
    handleSaveEvaluation,
    handleCancelEdit
  }
}

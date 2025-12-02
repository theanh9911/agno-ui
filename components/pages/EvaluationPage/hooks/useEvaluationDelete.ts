import React, { useState } from 'react'
import { useDeleteEvalsQuery } from '@/hooks/evals/useDeleteEvalsQuery'

interface EvaluationDeleteProps {
  selectedEvaluations: Set<string>
  onDeleteSuccess: (deletedIds: string[]) => void
  onBulkDeleteSuccess: () => void
}

export const useEvaluationDelete = ({
  onDeleteSuccess,
  onBulkDeleteSuccess
}: EvaluationDeleteProps) => {
  const deleteEvalsMutation = useDeleteEvalsQuery()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)
  const [evaluationToDelete, setEvaluationToDelete] = useState<string | null>(
    null
  )

  const handleDeleteEvaluation = (
    evaluationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    setEvaluationToDelete(evaluationId)
    setDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    setBulkDeleteModalOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (evaluationToDelete) {
      onDeleteSuccess([evaluationToDelete])
      setEvaluationToDelete(null)
    }
  }

  const handleBulkDeleteSuccess = () => {
    onBulkDeleteSuccess()
  }

  return {
    deleteEvalsMutation,
    handleDeleteEvaluation,
    handleBulkDelete,
    evaluationToDelete,
    deleteModalOpen,
    bulkDeleteModalOpen,
    setDeleteModalOpen,
    setBulkDeleteModalOpen,
    handleDeleteSuccess,
    handleBulkDeleteSuccess
  }
}

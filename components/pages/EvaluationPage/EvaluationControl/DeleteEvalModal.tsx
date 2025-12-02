import { type FC, useMemo } from 'react'
import { useDeleteEvalsQuery } from '@/hooks/evals/useDeleteEvalsQuery'
import { DeleteModal } from '@/components/modals/DeleteModal'

interface DeleteEvalModalProps {
  evaluationIds: string | string[]
  onDeleteSuccess?: () => void
}

const DeleteEvalModal: FC<DeleteEvalModalProps> = ({
  evaluationIds,
  onDeleteSuccess
}) => {
  const deleteEvalsMutation = useDeleteEvalsQuery()

  const idsArray = useMemo(
    () => (Array.isArray(evaluationIds) ? evaluationIds : [evaluationIds]),
    [evaluationIds]
  )
  const evaluationCount = idsArray.length

  const handleDelete = async () => {
    await deleteEvalsMutation.mutateAsync({
      eval_run_ids: idsArray
    })

    if (onDeleteSuccess) {
      onDeleteSuccess()
    }
  }

  return (
    <DeleteModal
      count={evaluationCount}
      onDelete={handleDelete}
      isLoading={deleteEvalsMutation.isPending}
    />
  )
}

export default DeleteEvalModal

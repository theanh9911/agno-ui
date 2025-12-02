import { SquareCheckbox } from '@/components/ui/square-checkbox'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/providers/DialogProvider'
import DeleteEvalModal from './DeleteEvalModal'
import { InlineInput } from './InlineInput'

interface HeaderCheckboxProps {
  isAllSelected: boolean
  isIndeterminate: boolean
  handleSelectAll: () => void
}

interface RowCheckboxProps {
  evaluationId: string
  selectedEvaluations: Set<string>
  handleSelectRow: (id: string) => void
  disabled?: boolean
}

interface DeleteButtonProps {
  evaluationId: string
  handleDeleteEvaluation: (id: string, e: React.MouseEvent) => void
  deleteEvalsMutation: { isPending: boolean }
}

interface EditButtonProps {
  evaluationId: string
  editingEvaluationId: string | null
  handleEditEvaluation: (id: string, e: React.MouseEvent) => void
  handleCancelEdit: () => void
}

interface EditRowProps {
  evaluationId: string
  editingEvaluationId: string | null
  handleSaveEvaluation: (id: string, newName: string) => void
  handleCancelEdit: () => void
}

export const HeaderCheckbox = ({
  isAllSelected,
  isIndeterminate,
  handleSelectAll
}: HeaderCheckboxProps) => (
  <SquareCheckbox
    checked={isIndeterminate ? false : isAllSelected}
    isIndeterminate={isIndeterminate}
    onCheckedChange={handleSelectAll}
  />
)

export const RowCheckbox = ({
  evaluationId,
  selectedEvaluations,
  handleSelectRow,
  disabled = false
}: RowCheckboxProps) => (
  <SquareCheckbox
    checked={selectedEvaluations?.has(evaluationId)}
    onCheckedChange={() => !disabled && handleSelectRow(evaluationId)}
    onClick={(e) => e?.stopPropagation()}
    disabled={disabled}
  />
)

export const DeleteButton = ({
  evaluationId,
  deleteEvalsMutation
}: DeleteButtonProps) => {
  const { openDialog } = useDialog()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDialog(<DeleteEvalModal evaluationIds={evaluationId} />)
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-destructive opacity-0 transition-opacity group-hover:bg-destructive group-hover:opacity-100"
      disabled={deleteEvalsMutation?.isPending}
      icon="trash"
      size="iconSmall"
      variant="destructive"
    />
  )
}

// DeleteModal component removed - now using openDialog directly

export const EditButton = ({
  evaluationId,
  editingEvaluationId,
  handleEditEvaluation,
  handleCancelEdit
}: EditButtonProps) => (
  <Button
    onClick={(e) =>
      editingEvaluationId === evaluationId
        ? handleCancelEdit()
        : handleEditEvaluation(evaluationId, e)
    }
    className="border border-border opacity-0 transition-opacity group-hover:bg-transparent group-hover:opacity-100"
    icon={editingEvaluationId === evaluationId ? 'close' : 'edit'}
    size="iconSmall"
    variant="secondary"
  />
)

export const EditRow = ({
  evaluationId,
  editingEvaluationId,
  handleSaveEvaluation,
  handleCancelEdit
}: EditRowProps) => {
  if (editingEvaluationId !== evaluationId) return null

  return (
    <tr className="relative">
      <td colSpan={5} className="p-0">
        <div className="relative">
          <InlineInput
            onSave={(newName) => handleSaveEvaluation(evaluationId, newName)}
            onCancel={handleCancelEdit}
          />
        </div>
      </td>
    </tr>
  )
}

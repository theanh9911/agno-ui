import { SquareCheckbox } from '@/components/ui/square-checkbox'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/providers/DialogProvider'
import { useDeleteDocumentById } from '@/hooks/knowledge/useDeleteDocumentById'
import { DeleteModal } from '@/components/modals/DeleteModal'
import {
  DocumentStatusEnums,
  KnowledgeDocument,
  KnowledgePageMode
} from '@/types/Knowledge'
import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import Icon from '@/components/ui/icon'

interface HeaderCheckboxProps {
  isAllSelected: boolean
  isIndeterminate: boolean
  handleSelectAll: () => void
}

interface RowCheckboxProps {
  documentId: string
  selectedDocuments: Set<string>
  handleSelectRow: (id: string) => void
  disabled?: boolean
}

interface EditDeleteCTAsProps {
  document: KnowledgeDocument
  status?: DocumentStatusEnums
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
  documentId,
  selectedDocuments,
  handleSelectRow,
  disabled = false
}: RowCheckboxProps) => (
  <SquareCheckbox
    checked={selectedDocuments?.has(documentId)}
    onCheckedChange={() => !disabled && handleSelectRow(documentId)}
    onClick={(e) => e?.stopPropagation()}
    disabled={disabled}
  />
)

export const EditDeleteCTAs = ({ document, status }: EditDeleteCTAsProps) => {
  const {
    setSelectedDocument,
    setContentDialogMode,
    setSelectedDocuments,
    selectedDocuments
  } = useKnowledgeStore()
  const { openDialog } = useDialog()

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDocument(document)
    setContentDialogMode(KnowledgePageMode.EDIT)
  }

  const deleteDocumentMutation = useDeleteDocumentById()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDialog(
      <DeleteModal
        onDelete={async () => {
          await deleteDocumentMutation.mutateAsync(document.id)
          // Remove only the deleted document from the set instead of clearing all
          const newSet = new Set(selectedDocuments)
          newSet.delete(document.id)
          setSelectedDocuments(newSet)
          setSelectedDocument(null)
        }}
        isLoading={deleteDocumentMutation.isPending}
      />
    )
  }

  return (
    <div className="flex items-center gap-1">
      {status === DocumentStatusEnums.PROCESSING ||
      status === DocumentStatusEnums.FAILED ? (
        <Button
          variant="ghost"
          size="iconSm"
          icon="trash"
          className="flex-shrink-0 text-destructive"
          onClick={handleDelete}
        />
      ) : (
        <>
          <Button
            variant="ghost"
            size="iconSm"
            icon="edit"
            className="flex-shrink-0"
            onClick={handleEdit}
          />
          <Button
            variant="ghost"
            size="iconSm"
            icon="trash"
            className="flex-shrink-0 text-destructive"
            onClick={handleDelete}
          />
          <Icon
            type="caret-right"
            size="xs"
            className="ml-1 flex-shrink-0 text-primary"
          />
        </>
      )}
    </div>
  )
}

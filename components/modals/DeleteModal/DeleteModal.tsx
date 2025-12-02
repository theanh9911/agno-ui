import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useDialog } from '@/providers/DialogProvider'

interface DeleteModalProps {
  /**
   * Number of items to be deleted
   */
  count?: number
  /**
   * Whether the delete action is in progress
   */
  isLoading?: boolean
  /**
   * Callback when delete is confirmed
   */
  onDelete: () => void | Promise<void>
}

const DeleteModal: FC<DeleteModalProps> = ({
  count = 1,
  isLoading = false,
  onDelete
}) => {
  const { closeDialog } = useDialog()
  const isMultiple = count > 1
  const itemText = isMultiple ? `these ${count} items` : `this item`

  const handleDelete = async () => {
    await onDelete()
    closeDialog()
  }

  return (
    <DialogContent
      className="w-[448px]"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="font-medium">
          Are you sure you want to delete {itemText}?
        </DialogTitle>
        <DialogDescription>This action is irreversible.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={closeDialog}
          disabled={isLoading}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full"
          type="button"
          variant="destructive"
        >
          {isLoading ? 'DELETING...' : 'DELETE'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteModal

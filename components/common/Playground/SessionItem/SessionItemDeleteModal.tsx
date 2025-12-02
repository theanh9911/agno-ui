import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface SessionItemDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const SessionItemDeleteModal: FC<SessionItemDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm delete session</DialogTitle>
        <DialogDescription>
          You are permanently deleting this session. This action is
          irreversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            CANCEL
          </Button>
        </DialogClose>
        <Button variant="destructive" onClick={onDelete} className="w-full">
          DELETE
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default SessionItemDeleteModal

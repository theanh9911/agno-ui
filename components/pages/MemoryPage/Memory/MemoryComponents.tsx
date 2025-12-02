import { Button } from '@/components/ui/button'
import { Memory } from '@/types/memory'
import Icon from '@/components/ui/icon'

interface ActionButtonsProps {
  memory: Memory
  onEdit: (e: React.MouseEvent, memory: Memory) => void
  onDelete: (e: React.MouseEvent, memory: Memory) => void
}

export const ActionButtons = ({
  memory,
  onEdit,
  onDelete
}: ActionButtonsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="iconSm"
      icon="edit"
      className="flex-shrink-0"
      onClick={(e) => {
        e.stopPropagation()
        onEdit(e, memory)
      }}
    />
    <Button
      variant="ghost"
      size="iconSm"
      icon="trash"
      className="flex-shrink-0 text-destructive"
      onClick={(e) => {
        e.stopPropagation()
        onDelete(e, memory)
      }}
    />
    <Icon
      type="caret-right"
      size="xs"
      className="ml-1 flex-shrink-0 text-primary"
    />
  </div>
)

'use client'

import { SquareCheckbox } from '@/components/ui/square-checkbox'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface DataTableHeaderCheckboxProps {
  checked: boolean | 'indeterminate'
  onCheckedChange: (checked: boolean | 'indeterminate') => void
}

interface DataTableRowCheckboxProps {
  rowId: string
  isSelected: boolean
  onSelectRow: (rowId: string, checked?: boolean | 'indeterminate') => void
  disabled?: boolean
}

interface DataTableActionsProps {
  onEdit?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  onView?: (e: React.MouseEvent) => void
  showEdit?: boolean
  showDelete?: boolean
  showView?: boolean
}

export const DataTableHeaderCheckbox = ({
  checked,
  onCheckedChange
}: DataTableHeaderCheckboxProps) => (
  <SquareCheckbox checked={checked} onCheckedChange={onCheckedChange} />
)

export const DataTableRowCheckbox = ({
  rowId,
  isSelected,
  onSelectRow,
  disabled = false
}: DataTableRowCheckboxProps) => (
  <SquareCheckbox
    checked={isSelected}
    onCheckedChange={(checked) => !disabled && onSelectRow(rowId, checked)}
    onClick={(e) => e?.stopPropagation()}
    disabled={disabled}
  />
)

export const DataTableActions = ({
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = true
}: DataTableActionsProps) => (
  <div className="flex items-center gap-1">
    {showEdit && onEdit && (
      <Button
        variant="ghost"
        size="iconSm"
        icon="edit"
        className="flex-shrink-0"
        onClick={onEdit}
      />
    )}
    {showDelete && onDelete && (
      <Button
        variant="ghost"
        size="iconSm"
        icon="trash"
        className="flex-shrink-0 text-destructive"
        onClick={onDelete}
      />
    )}
    {showView && onView && (
      <Icon
        type="caret-right"
        size="xs"
        className="flex-shrink-0 text-primary"
      />
    )}
  </div>
)

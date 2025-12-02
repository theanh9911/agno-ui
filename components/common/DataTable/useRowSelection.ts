import { useMemo } from 'react'
import { RowSelectionState, OnChangeFn } from '@tanstack/react-table'

interface UseRowSelectionProps<TData> {
  data: TData[]
  selectedItems: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  getItemId: (item: TData) => string
}

interface UseRowSelectionReturn {
  rowSelection: RowSelectionState
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  isAllSelected: boolean
  isIndeterminate: boolean
  selectedCount: number
  handleSelectAll: () => void
  handleSelectRow: (itemId: string) => void
}

/**
 * Reusable hook that handles row selection logic for DataTable
 * Manages conversion between Set<string> (business logic) and RowSelectionState (TanStack Table)
 */
export function useRowSelection<TData>({
  data,
  selectedItems,
  onSelectionChange,
  getItemId
}: UseRowSelectionProps<TData>): UseRowSelectionReturn {
  // Convert Set<string> to RowSelectionState keyed by item IDs (matches table getRowId)
  const rowSelection: RowSelectionState = useMemo(() => {
    const selection: RowSelectionState = {}
    data.forEach((item) => {
      const itemId = getItemId(item)
      if (selectedItems.has(itemId)) {
        selection[itemId] = true
      }
    })
    return selection
  }, [selectedItems, data, getItemId])

  // Handle row selection changes from TanStack Table
  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (
    newSelection:
      | RowSelectionState
      | ((prev: RowSelectionState) => RowSelectionState)
  ) => {
    const updatedSelection =
      typeof newSelection === 'function'
        ? newSelection(rowSelection)
        : newSelection

    const newSelectedIds = new Set<string>()
    Object.keys(updatedSelection).forEach((rowId) => {
      if (updatedSelection[rowId]) {
        newSelectedIds.add(rowId)
      }
    })

    // Prevent unnecessary updates to avoid render loops when selection hasn't changed
    const isSameSize = newSelectedIds.size === selectedItems.size
    let isSameContents = isSameSize
    if (isSameSize) {
      for (const id of newSelectedIds) {
        if (!selectedItems.has(id)) {
          isSameContents = false
          break
        }
      }
    } else {
      isSameContents = false
    }

    if (!isSameContents) {
      onSelectionChange(newSelectedIds)
    }
  }

  // Selection state calculations
  const selectedCount = selectedItems.size
  const selectableItemsCount = data.length
  const isAllSelected =
    selectedCount > 0 && selectedCount === selectableItemsCount
  const isIndeterminate =
    selectedCount > 0 && selectedCount < selectableItemsCount

  // Select/deselect all items
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange(new Set())
    } else {
      const allIds = new Set(data.map(getItemId))
      onSelectionChange(allIds)
    }
  }

  // Select/deselect individual item
  const handleSelectRow = (itemId: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    onSelectionChange(newSelection)
  }

  return {
    rowSelection,
    onRowSelectionChange,
    isAllSelected,
    isIndeterminate,
    selectedCount,
    handleSelectAll,
    handleSelectRow
  }
}

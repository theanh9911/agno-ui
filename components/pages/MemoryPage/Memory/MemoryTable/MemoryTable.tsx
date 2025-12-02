import { DataTable } from '@/components/common/DataTable'
import { MemoriesResponse, Memory, MemoryDialogModeType } from '@/types/memory'
import { useDialog } from '@/providers/DialogProvider'
import { MemoryCreateContent } from '../MemoryCreateContent'
import { MemoryDeleteContent } from '../MemoryDeleteContent'
import { useColumns } from './columns'
import { useMemoriesQuery } from '@/hooks/memory'
import { useMemoryStore } from '@/stores/MemoryStore'

type MemoryTableProps = {
  deleteOperations: {
    handleDeleteSuccess: () => void
  }
  isLoading?: boolean
  onMemorySelect: (memoryId: string) => void
}

const MemoryTable = ({
  deleteOperations,
  isLoading,
  onMemorySelect
}: MemoryTableProps) => {
  const { openDialog } = useDialog()
  const { data: memoriesResponse } = useMemoriesQuery()
  const memories: Memory[] = (memoriesResponse as MemoriesResponse)?.data || []
  const { selectedMemories, setSelectedMemories } = useMemoryStore()

  // Memory click handler
  const handleMemoryClick = (memoryId: string) => {
    onMemorySelect(memoryId)
  }

  // Edit click handler
  const handleEditClick = (e: React.MouseEvent, memory: Memory) => {
    e.stopPropagation()
    openDialog(
      <MemoryCreateContent
        memory={memory}
        mode={MemoryDialogModeType.EDIT}
        userId={memory.user_id}
      />
    )
  }

  // Delete click handler
  const handleDeleteClick = (e: React.MouseEvent, memory: Memory) => {
    e.stopPropagation()
    openDialog(
      <MemoryDeleteContent
        memory={memory}
        onDeleteSuccess={deleteOperations.handleDeleteSuccess}
      />
    )
  }
  const columns = useColumns(handleEditClick, handleDeleteClick)

  return (
    <DataTable
      columns={columns}
      data={memories}
      onRowClick={(row: Memory) => handleMemoryClick(row.memory_id)}
      getItemId={(d: Memory) => d.memory_id}
      enableRowSelection
      selectedItems={selectedMemories}
      onSelectionChange={setSelectedMemories}
      isLoading={isLoading}
    />
  )
}

export default MemoryTable

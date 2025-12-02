import { useCallback } from 'react'
import { useDeleteMemory, useBulkDeleteMemories } from '@/hooks/memory'
import { Memory } from '@/types/memory'
import { DeleteModal } from '@/components/modals/DeleteModal'
import { useMemoryStore } from '@/stores/MemoryStore'

interface MemoryDeleteContentProps {
  memory?: Memory | null
  memoryIds?: string[]
  onDeleteSuccess?: () => void
}

export function MemoryDeleteContent({
  memory,
  memoryIds,
  onDeleteSuccess
}: MemoryDeleteContentProps) {
  const deleteMemoryMutation = useDeleteMemory()
  const bulkDeleteMemoriesMutation = useBulkDeleteMemories()
  const { setSelectedMemories, selectedMemories } = useMemoryStore()
  const idsArray = memoryIds || (memory ? [memory.memory_id] : [])
  const memoryCount = idsArray.length

  const handleDelete = useCallback(async () => {
    if (!deleteMemoryMutation || !bulkDeleteMemoriesMutation) return

    if (memoryCount > 1) {
      await bulkDeleteMemoriesMutation.mutateAsync({
        memory_ids: idsArray
      })
    } else {
      await deleteMemoryMutation.mutateAsync(idsArray[0])
      const newSet = new Set(selectedMemories)
      newSet.delete(idsArray[0])
      setSelectedMemories(newSet)
    }

    if (onDeleteSuccess) {
      onDeleteSuccess()
    }
  }, [
    idsArray,
    memoryCount,
    deleteMemoryMutation,
    bulkDeleteMemoriesMutation,
    onDeleteSuccess
  ])

  const isLoading = !!(
    deleteMemoryMutation &&
    bulkDeleteMemoriesMutation &&
    (deleteMemoryMutation.isPending || bulkDeleteMemoriesMutation.isPending)
  )

  return (
    <DeleteModal
      count={memoryCount}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  )
}

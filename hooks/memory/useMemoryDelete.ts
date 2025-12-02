import React, { useState } from 'react'
import { useDeleteMemory } from './useDeleteMemory'
import { useBulkDeleteMemories } from './useBulkDeleteMemories'
import { Memory } from '@/types/memory'

interface MemoryDeleteProps {
  onDeleteSuccess: (deletedIds: string[]) => void
  onBulkDeleteSuccess: () => void
}

export const useMemoryDelete = ({
  onDeleteSuccess,
  onBulkDeleteSuccess
}: MemoryDeleteProps) => {
  const deleteMemoryMutation = useDeleteMemory()
  const bulkDeleteMemoriesMutation = useBulkDeleteMemories()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null)

  const handleDeleteMemory = (memory: Memory, e: React.MouseEvent) => {
    e.stopPropagation()
    setMemoryToDelete(memory)
    setDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    setBulkDeleteModalOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (memoryToDelete) {
      onDeleteSuccess([memoryToDelete.memory_id])
      setMemoryToDelete(null)
    }
  }

  const handleBulkDeleteSuccess = () => {
    onBulkDeleteSuccess()
  }

  const clearMemoryToDelete = () => {
    setMemoryToDelete(null)
  }

  return {
    deleteMemoryMutation,
    bulkDeleteMemoriesMutation,
    handleDeleteMemory,
    handleBulkDelete,
    memoryToDelete,
    deleteModalOpen,
    bulkDeleteModalOpen,
    setDeleteModalOpen,
    setBulkDeleteModalOpen,
    handleDeleteSuccess,
    handleBulkDeleteSuccess,
    clearMemoryToDelete
  }
}

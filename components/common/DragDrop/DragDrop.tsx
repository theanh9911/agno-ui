import { useState, ReactNode, useCallback } from 'react'
import Paragraph from '@/components/ui/typography/Paragraph'

interface DragDropProps {
  children: ReactNode
  onFilesDropped: (files: File[]) => void

  dragOverContent?: ReactNode
  className?: string
}

export default function DragDrop({
  children,
  onFilesDropped,

  dragOverContent,
  className = ''
}: DragDropProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const allFiles = Array.from(e.dataTransfer.files)
      onFilesDropped(allFiles)
    },
    [onFilesDropped]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  return (
    <div
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center backdrop-blur-lg">
          {dragOverContent || (
            <Paragraph size="lead">
              Drop files to add them to the list
            </Paragraph>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// SheetReasoning.tsx
import React, { memo, useEffect, useRef } from 'react'
import { ReasoningStepContent } from '@/types/playground'
import Icon from '@/components/ui/icon'
import { useSheet } from '@/providers/SheetProvider'
import { ReasoningSheetContent } from './ReasoningSheetContent'
import { motion } from 'framer-motion'
import Paragraph from '@/components/ui/typography/Paragraph'

interface ReasoningProps {
  reasoning?: ReasoningStepContent[]
  time?: string
  isLoading?: boolean
  label?: string
  open?: boolean
}

export const SheetReasoning = memo(({ reasoning, label }: ReasoningProps) => {
  const { openSheet, replaceSheetData, isOpen, isCurrent } = useSheet()
  const sheetIdRef = useRef<string>(null)

  const handleReasoningClick = () => {
    if (!reasoning || reasoning.length === 0) return
    // Open with a renderer + initialData and capture the sheet id
    const id = openSheet(
      (data: { steps: ReasoningStepContent[] }) => (
        <ReasoningSheetContent reasoning={data.steps} />
      ),
      {
        side: 'right',
        title: 'Reasoning',
        initialData: { steps: reasoning.slice() } // copy to avoid mutation
      }
    )
    sheetIdRef.current = id
  }

  // Mirror upstream prop -> sheet (only for *our* sheet instance)
  useEffect(() => {
    if (!reasoning) return
    if (!sheetIdRef.current) return
    if (!isOpen) return
    if (!isCurrent(sheetIdRef.current)) return

    // Always pass a NEW array reference so React re-renders
    replaceSheetData<{ steps: ReasoningStepContent[] }>({
      steps: reasoning.slice()
    })
  }, [reasoning, isOpen, isCurrent, replaceSheetData])

  if (!reasoning || reasoning.length === 0) return null

  return (
    <motion.div
      className={`cursor-pointer py-1`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      tabIndex={0}
      // Sometimes onClick never fires during streaming because the node
      // is re-mounted between mouseDown and mouseUp (so the click is lost).
      // Using onPointerDown ensures the handler always runs early,

      onPointerDown={handleReasoningClick}
    >
      <div className="flex w-fit items-center gap-2 rounded-sm bg-secondary px-2 py-1">
        <Icon type="brain-circuit-2" size="xs" />
        <Paragraph size="label" className="uppercase">
          {label || 'Reasoning'}
        </Paragraph>
        <Icon type="caret-right" size="xs" />
      </div>
    </motion.div>
  )
})

export default SheetReasoning

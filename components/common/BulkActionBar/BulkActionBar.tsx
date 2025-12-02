import { type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'

interface BulkAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'secondary' | 'outline'
  disabled?: boolean
  className?: string
}

interface BulkActionBarProps {
  selectedCount: number
  totalCount: number
  itemType: string
  onCancelSelection: () => void
  actions: BulkAction[]
  isDeleting?: boolean
  isPaginated?: boolean
  className?: string
}

const BulkActionBar: FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  itemType,
  onCancelSelection,
  actions,
  isDeleting = false,
  isPaginated = false,
  className = ''
}) => {
  const buttonClassName = 'h-6 rounded-sm'

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`] pointer-events-none absolute left-0 right-0 z-[9998] mx-auto w-full -translate-x-1/2 tracking-[-0.28px] ${
            isPaginated ? 'bottom-16 pb-2' : 'bottom-2'
          } ${className}`}
        >
          <div className="pointer-events-auto my-4 inline-flex w-[32.5rem] items-center justify-between rounded-lg border border-border bg-background py-2 pl-3 pr-2 shadow-lg backdrop-blur-sm">
            <Paragraph size="body">
              {selectedCount} of {totalCount} {itemType} selected
            </Paragraph>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancelSelection}
                disabled={isDeleting}
                className={buttonClassName}
              >
                CLEAR SELECTION
              </Button>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled || isDeleting}
                  className={buttonClassName}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BulkActionBar

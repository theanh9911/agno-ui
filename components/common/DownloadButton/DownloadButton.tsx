import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'

import Icon from '@/components/ui/icon'

import { cn } from '@/utils/cn'
import { type DownloadButtonProps } from './types'

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 }
}

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 1000

const DownloadButton = ({
  onDownload,
  className,
  downloadState
}: DownloadButtonProps) => {
  const [isDebouncing, setIsDebouncing] = useState(false)

  // Handle click with debounce
  const handleClick = useCallback(async () => {
    if (isDebouncing || downloadState === 'loading') {
      return
    }

    setIsDebouncing(true)

    try {
      await onDownload()
    } finally {
      setTimeout(() => {
        setIsDebouncing(false)
      }, DEBOUNCE_DELAY)
    }
  }, [isDebouncing, downloadState, onDownload])

  const isDisabled = isDebouncing || downloadState === 'loading'

  return (
    <motion.button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full',
        'hover:bg-secondary/80',
        className
      )}
      aria-label="Download"
    >
      <AnimatePresence mode="wait" initial={false}>
        {downloadState === 'loading' ? (
          <motion.span
            key="loading"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon
              type="loader-2"
              className="animate-spin text-primary"
              size="xs"
            />
          </motion.span>
        ) : downloadState === 'success' ? (
          <motion.span
            key="success"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon type="check-icon" className="text-primary" size="xs" />
          </motion.span>
        ) : downloadState === 'error' ? (
          <motion.span
            key="error"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon type="close" className="text-primary" size="xs" />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon type="download" className="text-primary" size="xs" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default DownloadButton

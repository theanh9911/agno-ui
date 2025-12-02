import { useEffect, useState, type FC } from 'react'

import { type CopyButtonProps } from './types'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { toast } from '@/components/ui/toast'
import Icon from '@/components/ui/icon'

const CopyButton: FC<CopyButtonProps> = ({
  content,
  className,
  size = 16,
  showToast = false
}) => {
  const [copied, setCopied] = useState(false)
  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
        if (showToast) {
          toast.success({
            description: 'Copied to clipboard'
          })
        }
      }, 1000)
    }
  }, [copied, showToast])

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9, opacity: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        navigator.clipboard.writeText(content as string)
        setCopied(!copied)
      }}
      className={cn('p-0.5', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="checkmark"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon type="check" size={size} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Icon type="copy" size={size} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default CopyButton

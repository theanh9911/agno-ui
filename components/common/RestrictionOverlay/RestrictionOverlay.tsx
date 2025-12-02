import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { type RestrictionOverlayProps } from './types'

const RestrictionOverlay = ({
  isVisible,
  children,
  className,
  onClose
}: RestrictionOverlayProps) => {
  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll when overlay is visible
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm',
        'duration-200 animate-in fade-in-0',
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'rounded-xl bg-background/95 p-6 shadow-2xl ring-1 ring-border',
          'duration-200 animate-in zoom-in-95 slide-in-from-bottom-2',
          'sm:p-7'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default RestrictionOverlay

import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { type CustomToastProps } from './types'
import Paragraph from '../typography/Paragraph'
import Spinner from '@/components/common/Spinner/Spinner'

const toastClassName =
  'relative bg-accent items-center border border-border rounded-md shadow-sm flex w-[350px] gap-3 py-4 pl-4 pr-6'

const borderVariants = cva('w-1 rounded-full self-stretch', {
  variants: {
    variant: {
      error: 'bg-destructive',
      success: 'bg-positive'
    }
  },
  defaultVariants: {
    variant: 'error'
  }
})

const CustomToast = React.forwardRef<HTMLDivElement, CustomToastProps>(
  (
    {
      variant,
      title,
      description,
      action,
      onClose,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={toastClassName} {...props}>
        {variant === 'loading' ? (
          <Spinner className="text-primary" />
        ) : (
          <div className={cn(borderVariants({ variant }))} />
        )}

        {/* Content */}
        <div className="flex-1 space-y-1">
          {title && (
            <Paragraph className="text-primary" size="title">
              {title}
            </Paragraph>
          )}
          {description && (
            <Paragraph className="text-primary/80" size="body">
              {description}
            </Paragraph>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <Button
            variant="outline"
            onClick={() => {
              action.onClick?.()
              onClose?.()
            }}
          >
            {action.label}
          </Button>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <div className="absolute right-[5.5px] top-1">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              aria-label="Close"
              className="size-fit p-0"
            >
              <Icon type="cross" size="xs" />
            </Button>
          </div>
        )}
      </div>
    )
  }
)

CustomToast.displayName = 'CustomToast'

export { CustomToast }
export type { CustomToastProps }

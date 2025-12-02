import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import Icon, { IconType } from './icon'
import { PARAGRAPH_SIZES } from './typography/Paragraph/constants'

const alertVariants = cva(
  'relative w-full border border-border flex text-left gap-2 text-primary rounded-sm p-2 text-sm shadow-[0 4px 4px 0 rgba(0, 0, 0, 0.25)]',
  {
    variants: {
      variant: {
        default: 'bg-secondary ',
        destructive: '  bg-destructive/10 '
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)
const ICON_TYPE: Record<string, IconType> = {
  // TODO: Add more variants as per DS
  default: 'info',
  destructive: 'alert-triangle'
}

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    <Icon
      type={ICON_TYPE[variant as keyof typeof ICON_TYPE]}
      size="xs"
      className="flex-shrink-0 text-primary"
    />

    {children}
  </div>
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) =>
  children ? (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  ) : null
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(PARAGRAPH_SIZES.xsmall, className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

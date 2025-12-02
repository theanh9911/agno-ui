import * as React from 'react'

import { cn } from '@/utils/cn'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'> & { error?: boolean }
>(({ className, onKeyDown, error, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[60px] w-full rounded-md border border-border bg-transparent p-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus:border-border-selected focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-secondary/50 disabled:text-muted/80',
      error && 'border-destructive/100 focus:border-destructive/100',
      className
    )}
    ref={ref}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
      }
      onKeyDown?.(e)
    }}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }

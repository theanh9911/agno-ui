import * as React from 'react'

import { cn } from '@/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'no-autofill-bg flex h-9 w-full rounded-md border border-border bg-transparent p-2 text-sm text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/80 focus:border-border-selected focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-secondary/50 disabled:text-muted/80',
        error && 'border-destructive/100 focus:border-destructive/100',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }

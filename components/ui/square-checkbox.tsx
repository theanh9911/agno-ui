import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/utils/cn'
import Icon from './icon'

type SquareCheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  isIndeterminate?: boolean
}

const SquareCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  SquareCheckboxProps
>(({ className, isIndeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'data-[state=checked]:text-primary-foreground peer size-[16px] shrink-0 rounded-[4px] border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      {isIndeterminate ? (
        <Icon type="minus" size="xxs" color="accent" />
      ) : (
        <Icon type="check" size="xxs" color="accent" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
SquareCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { SquareCheckbox }

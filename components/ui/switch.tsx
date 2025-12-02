import * as React from 'react'

import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/utils/cn'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'p-[1.6px]focus-visible:ring-offset-background peer inline-flex w-[28.8px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted/50',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block size-[12.8px] rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[12.8px] data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

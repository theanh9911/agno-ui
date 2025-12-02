import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/utils/cn'

const Tab2 = TabsPrimitive.Root

const Tab2List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center gap-1 rounded-md bg-secondary/100 p-1 text-primary/80',
      className
    )}
    {...props}
  />
))
Tab2List.displayName = TabsPrimitive.List.displayName

const Tab2Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-7 min-w-[40px] items-center justify-center whitespace-nowrap rounded-sm p-2 font-dmmono text-xs font-normal uppercase text-primary/80 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
Tab2Trigger.displayName = TabsPrimitive.Trigger.displayName

const Tab2Content = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
Tab2Content.displayName = TabsPrimitive.Content.displayName

export { Tab2, Tab2List, Tab2Trigger, Tab2Content }

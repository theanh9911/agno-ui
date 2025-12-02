import * as React from 'react'

import * as AccordionPrimitive from '@radix-ui/react-accordion'

import { cn } from '@/utils/cn'
import Icon, { IconType } from './icon'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  iconPosition?: 'left' | 'right'
  iconColor?: string
  iconClassname?: string
  icon?: IconType
  showIcon?: boolean
  backgroundColor?: string
  iconSize?: string
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    {
      className,
      children,
      iconPosition = 'left',
      iconColor = 'text-primary',
      iconSize = 'size-4',
      iconClassname = '',
      icon = 'triangle-down',
      showIcon = true,
      backgroundColor = 'bg-transparent',
      ...props
    },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex size-8 flex-1 items-center justify-between gap-2 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {iconPosition === 'left' && showIcon && (
          <Icon
            type={icon}
            className={cn(
              'shrink-0 transition-transform duration-200',
              iconColor,
              backgroundColor,
              iconSize,
              iconClassname
            )}
          />
        )}
        <div className={cn(iconPosition === 'right' && 'flex w-full')}>
          {children}
        </div>
        {iconPosition === 'right' && showIcon && (
          <Icon
            type={icon}
            className={cn(
              'size-4 shrink-0 transition-transform duration-200',
              iconColor,
              backgroundColor,
              iconSize,
              iconClassname
            )}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

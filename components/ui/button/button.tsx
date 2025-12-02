import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import LoadingSpinner from '@/components/common/LoadingSpinner'

import { cn } from '@/utils/cn'
import Icon from '@/components/ui/icon'
import { type ICONS } from '@/components/ui/icon/constants'

const buttonVariants = cva(
  'inline-flex cursor-pointer outline-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium  focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-dmmono uppercase select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-accent shadow-sm hover:bg-primary/80 focus-visible:ring-primary/50',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/80 focus-visible:ring-primary/50',
        outline:
          'border border-border text-primary bg-transparent shadow-sm hover:bg-primary/5 focus-visible:ring-primary/50',
        secondary:
          'bg-secondary text-primary shadow-sm hover:bg-secondary/50 focus-visible:ring-primary/50',
        ghost: 'hover:bg-primary/5 text-primary focus-visible:ring-primary/50',
        link: 'text-primary hover:text-primary/80 disabled:text-muted/50 focus-visible:ring-primary/50',
        reload: 'text-primary bg-background focus-visible:ring-primary/50',
        icon: 'hover:bg-none focus-visible:ring-primary/50'
      },
      size: {
        default:
          'h-9 px-4 py-2 text-xs font-normal leading-4 tracking-[0.24px]',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        xsmall: 'h-6 px-3 rounded-xs text-xs',
        iconXs: 'h-6 w-6 rounded-sm',
        iconSm: 'h-8 w-8',
        iconSmall: 'h-6 w-6 rounded-sm',
        small: 'h-6 rounded-sm px-3 text-xs',
        iconBreadcrumb: 'h-6 w-fit',
        xs: 'size-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const getIconSize = (size: string | undefined) => {
  switch (size) {
    case 'iconXs':
      return 10.67
    case 'iconSm':
      return 16
    default:
      return 'xs'
  }
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: keyof typeof ICONS
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size,
      asChild = false,
      isLoading = false,
      icon,

      children,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'relative',
          buttonVariants({ variant, size, className }),
          'inline-flex items-center gap-2',
          iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            className={cn(
              'absolute left-1/2 top-1/2 !mx-0 !mt-0 !size-4 -translate-x-1/2 -translate-y-1/2',
              variant === 'default' && 'stroke-accent',
              variant === 'destructive' && 'stroke-white',
              variant === 'outline' && 'stroke-primary',
              variant === 'secondary' && 'stroke-primary',
              variant === 'ghost' && 'stroke-zinc-900 dark:stroke-zinc-100',
              variant === 'link' && 'stroke-primary',
              variant === 'reload' && 'stroke-primary',
              variant === 'icon' && 'stroke-primary'
            )}
          />
        ) : (
          <>
            {icon && (
              <Icon
                type={icon}
                size={getIconSize(size ?? 'default')}
                className={cn(
                  variant === 'default' && 'text-accent',
                  variant === 'destructive' && 'text-white',
                  icon === 'loader' && 'animate-spin',

                  className,
                  'border-none'
                )}
              />
            )}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

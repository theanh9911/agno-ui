import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'
import Paragraph from './typography/Paragraph'
import Icon from './icon/Icon'
import { IconType } from './icon/types'

const badgeVariants = cva(
  'inline-flex items-center font-dmmono text-xs rounded-sm border py-[2px] text-xs font-normal cursor-default',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-accent shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-primary hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-primary shadow hover:bg-destructive/80',
        outline: 'text-primary border-border',
        brand:
          'border-transparent bg-[#ff4017] text-white hover:bg-[#ff4017]/80'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: IconType
  iconPosition?: 'left' | 'right'
}

const Badge = ({
  className,
  variant,
  children,
  icon,
  iconPosition = 'left',
  ...props
}: BadgeProps) => {
  const paddingClass = icon ? 'pl-[6px] pr-2' : 'px-2'

  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        'flex w-fit items-center gap-1',
        iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
        paddingClass,
        className
      )}
      {...props}
    >
      {icon && (
        <Icon
          type={icon}
          size="xs"
          className={cn(
            variant === 'default' && 'text-accent',
            icon === 'loader-2' && 'animate-spin'
          )}
        />
      )}
      <Paragraph size="label">{children}</Paragraph>
    </div>
  )
}

Badge.displayName = 'Badge'

export { Badge, badgeVariants }

import React from 'react'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { IconType } from '@/components/ui/icon/types'
import { cn } from '@/utils/cn'

interface FeaturesIconWrapperProps {
  text: string
  icon: IconType
  IconClassName?: string
  className?: string
  IconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'dot' | 'xxs' | number
}

export const FeaturesIconWrapper: React.FC<FeaturesIconWrapperProps> = ({
  text,
  icon,
  IconClassName,
  className,
  IconSize = 'xs'
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon
        type={icon}
        size={IconSize}
        className={cn('text-destructive', IconClassName)}
      />
      <Paragraph size="body" className="text-muted">
        {text}
      </Paragraph>
    </div>
  )
}

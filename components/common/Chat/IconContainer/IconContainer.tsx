import React, { type FC } from 'react'

import Icon from '@/components/ui/icon'
import { IconProps, type IconType } from '@/components/ui/icon/types'

import { cn } from '@/utils/cn'

type IconContainerProps = {
  icon: IconType
  color?: string
  className?: string
  size?: IconProps['size']
}

const IconContainer: FC<IconContainerProps> = ({ icon, color, className }) => (
  <div
    className={cn(
      'flex size-6 items-center justify-center rounded-[6.67px] p-1',
      color || 'bg-brand',
      className
    )}
  >
    <Icon type={icon} color={color || 'white'} size={13.33} />
  </div>
)

export default IconContainer

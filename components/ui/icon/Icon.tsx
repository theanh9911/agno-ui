import { type FC } from 'react'

import { cn } from '@/utils/cn'

import { ICONS } from './constants'
import { type IconProps } from './types'

const getSizeClass = (sizeValue: IconProps['size']) => {
  if (typeof sizeValue === 'number') {
    return `size-[${sizeValue}px]`
  }

  switch (sizeValue) {
    case 'xxs':
      return 'size-3'
    case 'xs':
      return 'size-4'
    case 'sm':
      return 'size-6'
    case 'md':
      return 'size-[42px]'
    case 'lg':
      return 'size-7'
    case 'dot':
      return 'size-[5.07px]'
    default:
      return 'size-6'
  }
}

const Icon: FC<IconProps> = ({
  type,
  size = 'sm',
  className,
  color,
  disabled = false
}) => {
  const IconElement = ICONS[type]

  // Create SVG props to override width and height when a size is provided
  const svgProps: {
    width?: undefined
    height?: undefined
    style?: { width?: string; height?: string }
  } = {}

  if (size !== undefined) {
    // Remove width and height attributes to allow CSS to control the size
    svgProps.width = undefined
    svgProps.height = undefined
    // Add style to ensure size is applied
    svgProps.style = {
      width: typeof size === 'number' ? `${size}px` : undefined,
      height: typeof size === 'number' ? `${size}px` : undefined
    }
  }

  return (
    <IconElement
      {...svgProps}
      className={cn(
        color && !disabled ? `text-${color}` : 'text-primary',
        disabled && 'cursor-default text-muted/50',
        getSizeClass(size),
        className
      )}
    />
  )
}

export default Icon

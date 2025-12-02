import { type FC } from 'react'
import { cn } from '@/utils/cn'
import { type WrapperProps } from './types'

const ContentWrapper: FC<WrapperProps> = ({
  children,
  className,
  customWidth
}) => (
  <div
    className={cn(
      'mx-auto flex h-full w-full items-start justify-center px-6',
      className
    )}
    style={{ maxWidth: customWidth ? `${customWidth}px` : '1920px' }}
  >
    {children}
  </div>
)

export default ContentWrapper

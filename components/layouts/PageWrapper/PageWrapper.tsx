import { type FC } from 'react'
import { cn } from '@/utils/cn'
import { type WrapperProps } from './types'

const PageWrapper: FC<WrapperProps> = ({
  children,
  className,
  customWidth
}) => (
  <div
    className={cn(
      'mx-auto flex h-full w-full flex-col overflow-y-auto',
      className
    )}
    style={{ maxWidth: customWidth ? `${customWidth}px` : '800px' }}
  >
    {children}
  </div>
)

export default PageWrapper

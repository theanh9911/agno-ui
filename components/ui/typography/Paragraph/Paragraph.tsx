import { forwardRef } from 'react'

import { cn } from '@/utils/cn'

import { PARAGRAPH_SIZES } from './constants'
import { type ParagraphProps } from './types'

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ children, size = 'default', className, ...rest }, ref) => (
    <p ref={ref} className={cn(PARAGRAPH_SIZES[size], className)} {...rest}>
      {children}
    </p>
  )
)

Paragraph.displayName = 'Paragraph'

export default Paragraph

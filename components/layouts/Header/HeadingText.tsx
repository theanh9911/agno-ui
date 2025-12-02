import Heading from '@/components/ui/typography/Heading'
import { cn } from '@/utils/cn'
import { FC } from 'react'

type HeadingTextProps = {
  text: string
  noTruncate?: boolean
  className?: string
}
const HeadingText: FC<HeadingTextProps> = ({ text, className, noTruncate }) => {
  return (
    <div
      className={cn(
        noTruncate
          ? ''
          : 'max-w-[200px] md:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[500px]'
      )}
    >
      <Heading
        size={3}
        className={cn(noTruncate ? '' : 'truncate', 'text-primary', className)}
      >
        {text}
      </Heading>
    </div>
  )
}

export default HeadingText

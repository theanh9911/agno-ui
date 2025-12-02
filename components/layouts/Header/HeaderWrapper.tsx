import { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

type HeaderContentProps = {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

type HeaderWrapperProps = {
  isLoading?: boolean
  className?: string
  topContent?: HeaderContentProps
  bottomContent?: HeaderContentProps
}

const HeaderWrapper: FC<HeaderWrapperProps> = ({
  isLoading,
  className,
  topContent,
  bottomContent
}) => {
  const renderContent = (content?: HeaderContentProps) => {
    if (!content) return null

    const { leftContent, rightContent } = content

    if (!leftContent && !rightContent) return null

    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          {isLoading ? <Skeleton className="h-8 w-44" /> : leftContent}
        </div>
        <div className="flex items-center">
          {isLoading ? <Skeleton className="h-8 w-44" /> : rightContent}
        </div>
      </div>
    )
  }
  return (
    <div className={cn(topContent && 'gap-y-6', 'header-gradient', className)}>
      {renderContent(topContent)}
      {renderContent(bottomContent)}
    </div>
  )
}

export default HeaderWrapper

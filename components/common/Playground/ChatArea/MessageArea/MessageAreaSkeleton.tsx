import { memo, useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface MessageAreaSkeletonProps {
  blocks?: number
}

const MessageAreaSkeleton = ({ blocks = 2 }: MessageAreaSkeletonProps) => {
  const items = useMemo(() => Array.from({ length: blocks }), [blocks])

  return (
    <div className="space-y-16">
      {items.map((_, idx) => (
        <div key={idx} className="flex flex-col gap-y-6">
          {/* User message skeleton */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex max-w-[75%] flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-full animate-pulse" />
              <Skeleton className="h-4 w-[50%] animate-pulse" />
            </div>
          </div>

          {/* Agent message skeleton */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex max-w-[80%] flex-1 flex-col gap-2">
              <div className="rounded-md">
                <Skeleton className="mb-2 h-4 w-5/6 animate-pulse" />
                <Skeleton className="mb-2 h-4 w-2/3 animate-pulse" />
                <Skeleton className="h-4 w-3/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(MessageAreaSkeleton)

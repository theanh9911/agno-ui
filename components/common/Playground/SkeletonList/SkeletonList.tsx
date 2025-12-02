import { useMemo, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

import type { SkeletonListProps } from './types'

const SkeletonList: FC<SkeletonListProps> = ({ skeletonCount }) => {
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount]
  )

  return skeletons.map((skeleton, index) => (
    <Skeleton
      key={skeleton}
      className={cn('mx-3 mb-2 h-10', index > 0 && 'bg-secondary')}
    />
  ))
}

export default SkeletonList

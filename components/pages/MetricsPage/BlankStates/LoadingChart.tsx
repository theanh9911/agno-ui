import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const LoadingChart = () => {
  return (
    <Skeleton className="absolute left-0 top-0 h-full w-full animate-pulse" />
  )
}

export default LoadingChart

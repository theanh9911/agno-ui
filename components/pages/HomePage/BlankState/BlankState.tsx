import { Skeleton } from '@/components/ui/skeleton'

const SectionSkeleton = () => (
  <div className="flex w-full flex-col gap-2">
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
)
export const ComponentConfigListLoadingState = () => {
  return (
    <div className="flex w-full flex-wrap gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <SectionSkeleton key={index} />
      ))}
    </div>
  )
}

export const ConnectedOSSkeleton = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div className="flex w-full flex-col gap-4" key={index}>
      <Skeleton className="h-6 w-32" />
      <div className="grid w-full grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-[62px] w-full" key={index} />
        ))}
      </div>
    </div>
  ))
}

export const HomePageLoadingState = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid-responsive-basic w-full gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-20 w-full" key={index} />
        ))}
      </div>
    </div>
  )
}

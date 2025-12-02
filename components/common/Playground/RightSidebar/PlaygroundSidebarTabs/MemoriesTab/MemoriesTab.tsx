import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo
} from 'react'
import MemoriesBlankState from '../../../BlankStates/MemoriesBlankState'
import SkeletonList from '../../../SkeletonList'

import Paragraph from '@/components/ui/typography/Paragraph'
import { Badge } from '@/components/ui/badge'
import InfoDetails from '../../../InfoDetails/InfoDetails'
import { Memories } from '@/types/playground'
import DetailsDialog from '../../../InfoDetails/DetailsDialog'
import dayjs from 'dayjs'
import { formatDate } from '@/utils/format'
import Tooltip from '@/components/common/Tooltip'
import { Button } from '@/components/ui/button'

import { useOSStore } from '@/stores/OSStore'
import Icon from '@/components/ui/icon'
import useFetchPlaygroundMemories from '@/hooks/playground/useFetchPlaygroundMemories'

const MemoryDetailsContent = memo(({ memory }: { memory: Memories }) => (
  <div className="flex flex-col gap-y-4">
    <InfoDetails
      title="Memory"
      icon="details"
      content={memory.memory}
      hover={false}
    />
    {memory.topics && memory.topics.length > 0 && (
      <InfoDetails
        title="Topics"
        icon="tags"
        hover={false}
        content={
          <ul className="list-inside list-disc space-y-1">
            {memory.topics
              .filter((topic) => topic && topic.trim() !== '')
              .map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
          </ul>
        }
      />
    )}

    <InfoDetails
      title="Last Updated"
      icon="time"
      content={formatDate(dayjs(memory.updated_at).utc(), 'natural-with-time')}
      hover={false}
    />
  </div>
))

MemoryDetailsContent.displayName = 'MemoryDetailsContent'

const MemoryItem = memo(({ memory }: { memory: Memories }) => {
  const [visibleCount, setVisibleCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const topics = memory.topics?.filter(Boolean) || []

  useEffect(() => {
    const measureTopics = () => {
      if (!containerRef.current || topics.length === 0) return

      const containerWidth = containerRef.current.offsetWidth
      setVisibleCount(topics.length)
      setTimeout(() => {
        if (!containerRef.current) return
        const badgeElements =
          containerRef.current.querySelectorAll('.topic-badge')
        let totalWidth = 0
        let visibleBadges = 0
        const gapWidth = 8

        for (let i = 0; i < badgeElements.length; i++) {
          const badge = badgeElements[i] as HTMLElement
          totalWidth += badge.offsetWidth + gapWidth

          const overflowBadgeWidth = 50

          if (
            totalWidth +
              (i < badgeElements.length - 1 ? overflowBadgeWidth : 0) >
            containerWidth
          ) {
            break
          }

          visibleBadges++
        }

        visibleBadges = Math.max(1, visibleBadges)

        if (visibleBadges !== visibleCount) {
          setVisibleCount(visibleBadges)
        }
      }, 0)
    }
    measureTopics()
  }, [topics.length])

  const visibleTopics = topics.slice(0, visibleCount)
  const overflowTopics = topics.slice(visibleCount)

  return (
    <div className="flex flex-col flex-wrap gap-4 rounded-sm bg-secondary/50 p-2">
      <div className="flex w-full justify-between gap-4">
        <Paragraph size="body" className="line-clamp-2 text-primary">
          {memory.memory}
        </Paragraph>
        <DetailsDialog customContent={<MemoryDetailsContent memory={memory} />}>
          <Button
            type="button"
            variant="secondary"
            icon="maximize"
            size="iconXs"
            className="group shrink-0"
          />
        </DetailsDialog>
      </div>

      {topics.length > 0 && (
        <div
          ref={containerRef}
          className="flex w-full shrink-0 grow-0 flex-nowrap items-center gap-2 overflow-hidden"
        >
          {visibleTopics.map((topic, index) => (
            <Badge
              variant="outline"
              key={`${topic}-${index}`}
              className="topic-badge h-[21px]"
            >
              <span className="flex h-full items-center whitespace-nowrap font-dmmono uppercase text-muted">
                {topic}
              </span>
            </Badge>
          ))}

          {overflowTopics.length > 0 && (
            <DetailsDialog
              customContent={<MemoryDetailsContent memory={memory} />}
            >
              <Tooltip
                content={overflowTopics.join(', ')}
                delayDuration={0}
                side="top"
                contentClassName="max-w-xs whitespace-pre-wrap break-words"
              >
                <span>
                  <Badge
                    variant="outline"
                    className="flex h-[21px] cursor-pointer items-center font-dmmono uppercase text-muted"
                  >
                    +{overflowTopics.length}
                  </Badge>
                </span>
              </Tooltip>
            </DetailsDialog>
          )}
        </div>
      )}
    </div>
  )
})

MemoryItem.displayName = 'MemoryItem'

const MemoriesTab = () => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null

  const {
    data: memoriesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchPlaygroundMemories()

  const shouldShowLoader = hasNextPage && !isLoading

  // Flatten all memories from all pages, from [[123], [456]] to [123, 456]
  const allMemories = useMemo(() => {
    if (!memoriesData?.pages) return []
    return memoriesData.pages.flatMap((page) => page?.data ?? [])
  }, [memoriesData])

  const handleFetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) {
      return
    }

    await fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const loaderElement = loaderRef.current

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // Only observe if loader is visible and shouldShowLoader is true
    if (!loaderElement || !shouldShowLoader) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries // get the first entry
        if (entry.isIntersecting) {
          // is loader visible and is intersecting
          handleFetchNextPage() // fetch the next page
        }
      },
      {
        threshold: 0.1 //trigger when 10% of the loader is visible
      }
    )

    observerRef.current.observe(loaderElement) // observe the loader

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [shouldShowLoader, handleFetchNextPage])

  if (isLoading) return <SkeletonList skeletonCount={5} />

  if (!selectedEndpoint || allMemories?.length === 0)
    return <MemoriesBlankState />

  return (
    <div className="flex w-full shrink-0 grow-0 flex-col gap-2 overflow-x-hidden pt-2">
      <Paragraph size="label" className="uppercase text-muted">
        Memories
      </Paragraph>
      {allMemories?.map((memory) => (
        <MemoryItem key={memory.memory_id} memory={memory} />
      ))}

      {shouldShowLoader && (
        <div ref={loaderRef} className="mx-auto w-full py-2">
          <Icon type="loader" size="xs" className="animate-spin" />
        </div>
      )}
    </div>
  )
}

export default memo(MemoriesTab)

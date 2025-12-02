import Paragraph from '@/components/ui/typography/Paragraph'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import RunList from './RunList'

interface RunsTableProps<T = unknown> {
  items: T[]
  activeRunId: string | null
  getRunId: (item: T) => string
  getLabel: (item: T) => string
}

const RunsTable = <T,>({
  items,
  activeRunId,
  getRunId,
  getLabel
}: RunsTableProps<T>) => {
  const activeRunRef = useRef<HTMLAnchorElement>(null)
  const [showAllRuns, setShowAllRuns] = useState(false)
  const [activeInViewRunId, setActiveInViewRunId] = useState<string | null>(
    activeRunId
  )

  // Determine which runs are currently rendered in the sidebar
  const runsToShow = useMemo(
    () => (showAllRuns ? items : items.slice(-5)),
    [showAllRuns, items]
  )

  // Sync scroll-to-active item in the list when the active changes
  useEffect(() => {
    if (activeRunRef.current) {
      activeRunRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [activeInViewRunId])

  // Observe conversation blocks in the main message area and set active run
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Track by highest intersection ratio
        let best: { id: string; ratio: number } | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id // conversation-<run_id>
          const ratio = entry.intersectionRatio
          if (!best || ratio > best.ratio) {
            best = { id, ratio }
          }
        }

        if (best) {
          const runId = best.id.replace('conversation-', '')
          setActiveInViewRunId((prev) => (prev === runId ? prev : runId))
        }
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    // Select all conversation containers in the DOM
    const nodes = Array.from(
      document.querySelectorAll<HTMLDivElement>("div[id^='conversation-']")
    )
    nodes.forEach((node) => observer.observe(node))

    return () => {
      nodes.forEach((node) => observer.unobserve(node))
      observer.disconnect()
    }
  }, [items])

  // Ensure the sidebar expands when the active run is not within the last 5
  useEffect(() => {
    if (!activeInViewRunId) return
    const runIdsInList = new Set(runsToShow.map((c) => getRunId(c)))
    if (!runIdsInList.has(activeInViewRunId)) {
      setShowAllRuns(true)
    }
  }, [activeInViewRunId, runsToShow])

  const handleToggleShowMore = () => {
    setShowAllRuns(!showAllRuns)
  }

  const effectiveActiveRunId = activeInViewRunId ?? activeRunId

  return (
    <div className="flex w-full flex-col gap-2 overflow-y-auto">
      <RunList
        items={runsToShow}
        activeRunId={effectiveActiveRunId}
        activeRunRef={activeRunRef}
        getRunId={getRunId}
        getLabel={getLabel}
      />
      {items.length > 5 && (
        <div
          className="w-fit cursor-pointer text-primary"
          onClick={handleToggleShowMore}
        >
          <Paragraph size="label" className="uppercase">
            {showAllRuns ? 'Show Less' : 'Show More'}
          </Paragraph>
        </div>
      )}
    </div>
  )
}

export default RunsTable

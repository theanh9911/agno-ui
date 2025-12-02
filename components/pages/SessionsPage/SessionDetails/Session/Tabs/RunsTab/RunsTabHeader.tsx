import { FormatType, Tab } from '@/components/pages/SessionsPage/types'
import Paragraph from '@/components/ui/typography/Paragraph'
import { useSessionStore } from '@/stores/SessionsStore'
import { cn } from '@/utils/cn'
import React, { useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Tab2, Tab2List, Tab2Trigger } from '@/components/ui/tab2'
import { useRunsQuery } from '@/hooks/sessions'
import { useParams } from '@/utils/navigation'
import { useFilterType } from '@/hooks/useFilterType'

const RunsTabHeader = () => {
  const { id } = useParams()
  const { data: runs, isLoading } = useRunsQuery()
  const viewMode = useSessionStore((state) => state.viewMode)
  const currentTab = useSessionStore((state) => state.currentTab)
  const isShowingDetails = useSessionStore((state) => state.isShowingDetails)
  const setIsShowingDetails = useSessionStore(
    (state) => state.setIsShowingDetails
  )
  const setViewMode = useSessionStore((state) => state.setViewMode)
  const { isWorkflow } = useFilterType()
  useEffect(() => {
    setViewMode(FormatType.Formatted)
  }, [id])
  if (currentTab !== Tab.Run || isLoading) return null

  return (
    <div
      className={cn(
        'sticky left-0 top-0 z-[999] flex w-full items-center gap-4 bg-inherit',
        !isLoading ? 'justify-between' : 'justify-end'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-4 items-center justify-center rounded-[4px] bg-secondary">
          <Paragraph size="mono">{runs?.length}</Paragraph>
        </div>
        <Paragraph size="body">
          {(runs?.length ?? 0) > 1 ? 'Runs' : 'Run'}
        </Paragraph>
      </div>

      <div className="flex items-center gap-2">
        {!isWorkflow && (
          <>
            <Paragraph size="body" className="text-muted">
              Show Details
            </Paragraph>
            <Switch
              id="show-details"
              checked={isShowingDetails}
              onCheckedChange={(value) => setIsShowingDetails(value)}
            />
          </>
        )}

        <Tab2
          value={isShowingDetails ? FormatType.Text : viewMode!}
          className="max-h-9"
          onValueChange={(value) => setViewMode(value as FormatType)}
        >
          <Tab2List>
            <Tab2Trigger
              disabled={isShowingDetails}
              value={FormatType.Formatted}
            >
              Formatted
            </Tab2Trigger>
            <Tab2Trigger value={FormatType.Text}>Text</Tab2Trigger>
          </Tab2List>
        </Tab2>
      </div>
    </div>
  )
}

export default RunsTabHeader

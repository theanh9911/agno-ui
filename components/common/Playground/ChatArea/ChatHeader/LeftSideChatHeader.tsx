import React, { useMemo } from 'react'
import Icon from '@/components/ui/icon'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'
import { useChatHeaderBreadcrumbData } from '@/hooks/useChatHeaderBreadcrumbData'
import { FilterType } from '@/types/filter'
import { IconType } from '@/components/ui/icon'
import SessionBreadcrumb from './SessionBreadcrumb'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { useFilterType } from '@/hooks/useFilterType'
import useWorkflowRunsForSession from '@/hooks/workflows/useWorkflowRunsForSession'

const Separator = () => (
  <BreadcrumbSeparator>
    <Icon type="slash" size={14} className="text-muted" />
  </BreadcrumbSeparator>
)

// Helper function to create section label with icon
const createSectionLabel = (icon: IconType, label: string) => (
  <div className="flex items-center gap-2">
    <Icon type={icon} size={16} />
    <span>{label}</span>
  </div>
)

// Helper function to get section selected item
const getSectionSelectedItem = (
  type: FilterType,
  selectorItems: Array<{ label: string; value: FilterType; icon: IconType }>
) => {
  const currentItem = selectorItems.find((item) => item.value === type)
  return {
    value: type,
    label: createSectionLabel(
      currentItem?.icon || 'avatar',
      currentItem?.label || 'Agents'
    )
  }
}

// Helper function to get section item list
const getSectionItemList = (
  selectorItems: Array<{ label: string; value: FilterType; icon: IconType }>
) =>
  selectorItems.map((item) => ({
    value: item.value,
    label: createSectionLabel(item.icon, item.label)
  }))

const LeftSideChatHeader = () => {
  // Streaming flags and message lengths from stores
  const { isWorkflow, isTeam } = useFilterType()
  const isAgentsStreaming = useAgentsPlaygroundStore((s) => s.isStreaming)
  const agentsMessagesLength = useAgentsPlaygroundStore(
    (s) => s.messages.length
  )
  const isTeamsStreaming = useTeamsPlaygroundStore((s) => s.isStreaming)
  const teamsMessagesLength = useTeamsPlaygroundStore((s) => s.messages.length)

  const {
    selectorItems,
    type,
    currentOptions,
    currentSelectedItem,
    currentSessionName,
    session,
    shouldShowAgentBreadcrumb,
    shouldShowSessionsBreadcrumb,
    handleSectionSelect,
    handleEntitySelect,
    handleSessionRename,
    handleSessionDelete
  } = useChatHeaderBreadcrumbData()

  // Use session-specific merged workflow runs + streaming state
  const { mergedRuns, isStreaming: isWorkflowStreaming } =
    useWorkflowRunsForSession(session)
  const workflowMessagesLength = mergedRuns.length

  const computedIsStreaming = isWorkflow
    ? isWorkflowStreaming
    : isTeam
      ? isTeamsStreaming
      : isAgentsStreaming

  const computedMessagesLength = isWorkflow
    ? workflowMessagesLength
    : isTeam
      ? teamsMessagesLength
      : agentsMessagesLength

  // Use helper functions to get section data
  const sectionSelectedItem = useMemo(
    () => getSectionSelectedItem(type, selectorItems),
    [type, selectorItems]
  )

  const sectionItemList = useMemo(
    () => getSectionItemList(selectorItems),
    [selectorItems]
  )

  return (
    <div className="flex items-center gap-2">
      {/* Section Icon */}

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          {/* Section Breadcrumb */}
          <div className="flex-shrink-0">
            <BreadcrumbCombobox
              selectedItem={sectionSelectedItem}
              itemList={sectionItemList}
              onItemSelect={handleSectionSelect}
              popoverWidth="w-[180px]"
              showOnHover={true}
            />
          </div>
          {shouldShowAgentBreadcrumb && (
            <>
              <Separator />
              {/* Agent/Team/Workflow Breadcrumb */}
              <div className="flex-shrink-0">
                <BreadcrumbCombobox
                  selectedItem={currentSelectedItem}
                  itemList={currentOptions}
                  onItemSelect={handleEntitySelect}
                  popoverWidth="w-[202px]"
                  showOnHover={true}
                  tooltipLength={20}
                  tooltipSide="right"
                  triggerTooltipSide="top"
                />
              </div>
            </>
          )}

          {shouldShowSessionsBreadcrumb && (
            <>
              <Separator />
              {/* Session Breadcrumb */}
              <div className="flex-shrink-0">
                <SessionBreadcrumb
                  sessionId={session || ''}
                  sessionName={currentSessionName ?? 'New Session'}
                  onRename={handleSessionRename}
                  onDelete={handleSessionDelete}
                  isStreaming={computedIsStreaming}
                  messagesLength={computedMessagesLength}
                />
              </div>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default LeftSideChatHeader

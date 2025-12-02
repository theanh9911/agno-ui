import { WorkflowRealtimeEvent, WorkflowStatus } from '@/types/workflow'
import {
  mapWorkflowToolToAgentTool,
  getIconForEvent,
  getLabelForEvent,
  isToolEvent,
  isToolCompleted,
  isRunStart as isRunStartEvt,
  isRunTerminal as isRunTerminalEvt
} from './utils'
import ToolCallEventRow from './ToolCallEventRow'
import WorkflowEventRow from './WorkflowEventRow'

function WorkflowEventItem({
  evt,
  completedRunIds,
  isStreaming
}: {
  evt: WorkflowRealtimeEvent
  completedRunIds: Set<string>
  isStreaming: boolean
}) {
  if (isToolEvent(evt.event)) {
    const agentTool = mapWorkflowToolToAgentTool(evt.tool)
    return (
      <ToolCallEventRow
        tool={agentTool}
        isWorkflowStreaming={isStreaming}
        isCompleted={isToolCompleted(evt)}
      />
    )
  }

  const iconType = getIconForEvent(evt.event)
  const label = getLabelForEvent(evt)
  const isRunTerminal = isRunTerminalEvt(evt.event)
  const isRunStart = isRunStartEvt(evt.event)
  const isCompletedForThisRun = evt.run_id
    ? completedRunIds.has(evt.run_id)
    : false

  let status: WorkflowStatus | undefined
  switch (true) {
    case isRunTerminal: {
      status = 'COMPLETED'
      break
    }
    case isRunStart && !isCompletedForThisRun && isStreaming: {
      status = 'RUNNING'
      break
    }
    default: {
      status = undefined
    }
  }

  return (
    <WorkflowEventRow
      iconType={iconType}
      tooltip={label.tooltip}
      label={label.primary}
      badge={label.badge}
      status={status}
    />
  )
}

export function WorkflowEventsMapping({
  events,
  completedRunIds,
  isStreaming = false
}: {
  events: WorkflowRealtimeEvent[]
  completedRunIds: Set<string>
  isStreaming?: boolean
}) {
  return (
    <>
      {events?.map((evt, idx) => (
        <div
          key={`${evt.event}-${evt.created_at}-${idx}`}
          className="transition-opacity duration-300 ease-in-out"
        >
          <WorkflowEventItem
            isStreaming={isStreaming}
            evt={evt}
            completedRunIds={completedRunIds}
          />
        </div>
      ))}
    </>
  )
}

export default WorkflowEventsMapping

import { formatSmallerTime } from '@/utils/format'
import { ToolCall as AgentToolCall } from '@/types/Agent'
import {
  ToolCall as WorkflowToolCall,
  WorkflowRealtimeEvent,
  WorkflowEvent
} from '@/types/workflow'
import { IconType } from '@/components/ui/icon'
import { RunEvent, TeamRunEvent } from '@/types/playground'

export function processWorkflowEvents(events: WorkflowRealtimeEvent[]): {
  processedEvents: WorkflowRealtimeEvent[]
  completedRunIds: Set<string>
} {
  if (!events?.length)
    return { processedEvents: [], completedRunIds: new Set<string>() }
  const result: WorkflowRealtimeEvent[] = []
  const seenRunStarted = new Set<string>()
  const seenRunCompleted = new Set<string>()
  const toolIndexById = new Map<string, number>()

  for (const evt of events ?? []) {
    const rid = evt.run_id || ''
    const isRunContent =
      evt.event === RunEvent.RunContent ||
      evt.event === TeamRunEvent.TeamRunContent

    const isRunStarted =
      evt.event === RunEvent.RunStarted ||
      evt.event === TeamRunEvent.TeamRunStarted

    const isRunCompleted =
      evt.event === RunEvent.RunCompleted ||
      evt.event === TeamRunEvent.TeamRunCompleted

    if (isRunContent) continue

    const isToolEventFlag = isToolEvent(evt.event)

    if (isToolEventFlag && evt.tool?.tool_call_id) {
      const toolId = evt.tool.tool_call_id
      const isCompletedEvt =
        evt.event === RunEvent.ToolCallCompleted ||
        evt.event === TeamRunEvent.TeamToolCallCompleted

      if (toolIndexById.has(toolId)) {
        const idx = toolIndexById.get(toolId) as number
        const prev = result[idx]
        result[idx] = {
          ...prev,
          tool: { ...(prev.tool || {}), ...(evt.tool || {}) },
          tool_completed: isCompletedEvt || prev.tool_completed === true
        }
      } else {
        const toPush: WorkflowRealtimeEvent = {
          ...evt,
          tool_completed: isCompletedEvt
        }
        toolIndexById.set(toolId, result.length)
        result.push(toPush)
      }
      continue
    }

    if (isRunStarted) {
      if (!seenRunStarted.has(rid)) {
        seenRunStarted.add(rid)
        result.push(evt)
      }
      continue
    }

    if (isRunCompleted) {
      if (!seenRunCompleted.has(rid)) {
        seenRunCompleted.add(rid)
        result.push(evt)
      }
      continue
    }

    result.push(evt)
  }

  return { processedEvents: result, completedRunIds: seenRunCompleted }
}

export function getEventsLabel(
  processedEvents: WorkflowRealtimeEvent[]
): string {
  if (!processedEvents || processedEvents.length === 0)
    return 'Behind the scenes'
  const latest = processedEvents[processedEvents.length - 1]
  const e = latest.event

  switch (e) {
    case WorkflowEvent.WorkflowFailed:
      return 'Workflow failed'

    case WorkflowEvent.WorkflowAgentCompleted:
    case WorkflowEvent.WorkflowCompleted: {
      const duration = latest?.metrics?.duration ?? latest?.metrics?.time
      if (typeof duration !== 'number') return 'Behind the scenes'
      if (duration) {
        const smaller = formatSmallerTime(duration)
        return `Worked for ${smaller.value} ${smaller.unit}`
      }
      return 'Behind the scenes'
    }

    case WorkflowEvent.WorkflowStarted:
      return 'Working...'

    case WorkflowEvent.StepStarted:
      return `Step started: ${latest.step_name || latest.step_id || ''}`

    case WorkflowEvent.StepCompleted:
      return `Step completed: ${latest.step_name || latest.step_id || ''}`

    case WorkflowEvent.ParallelExecutionStarted:
      return 'Parallel started'

    case WorkflowEvent.ParallelExecutionCompleted:
      return 'Parallel completed'

    case WorkflowEvent.ConditionExecutionStarted:
      return 'Condition started'

    case WorkflowEvent.ConditionExecutionCompleted:
      return 'Condition completed'

    case WorkflowEvent.LoopExecutionStarted:
      return 'Loop started'

    case WorkflowEvent.LoopExecutionCompleted:
      return 'Loop completed'

    case WorkflowEvent.RouterExecutionStarted:
      return 'Router started'

    case WorkflowEvent.RouterExecutionCompleted:
      return 'Router completed'

    case WorkflowEvent.StepsExecutionStarted:
      return 'Steps started'

    case WorkflowEvent.StepsExecutionCompleted:
      return 'Steps completed'

    case RunEvent.ToolCallStarted:
    case TeamRunEvent.TeamToolCallStarted:
      return `Calling Tool: ${latest.tool?.tool_name ?? ''}`

    case RunEvent.ToolCallCompleted:
    case TeamRunEvent.TeamToolCallCompleted:
      return `Tool call completed: ${latest.tool?.tool_name ?? ''}`

    case RunEvent.RunStarted: {
      const who = latest.agent_name
      const name = who ? ` by ${who}` : ''
      return `Run started${name}`
    }

    case TeamRunEvent.TeamRunStarted: {
      const who = latest.team_name
      const name = who ? ` by ${who}` : ''
      return `Team started${name}`
    }

    case RunEvent.RunCompleted:
    case TeamRunEvent.TeamRunCompleted:
      if (latest.team_name) return `${latest.team_name}: run completed`
      if (latest.agent_name) return `${latest.agent_name}: run completed`
      return 'Run completed'

    default:
      return 'Working...'
  }
}

export function getIconForEvent(event: string): IconType {
  switch (event) {
    case WorkflowEvent.WorkflowStarted:
      return 'workflow'

    case WorkflowEvent.WorkflowCompleted:
      return 'check-circle-2'

    case WorkflowEvent.WorkflowFailed:
      return 'alert-triangle'

    case WorkflowEvent.StepStarted:
      return 'play'

    case WorkflowEvent.StepCompleted:
      return 'check-circle-2'

    case WorkflowEvent.ParallelExecutionStarted:
    case WorkflowEvent.ParallelExecutionCompleted:
      return 'network'

    case WorkflowEvent.ConditionExecutionStarted:
    case WorkflowEvent.ConditionExecutionCompleted:
      return 'split'

    case WorkflowEvent.LoopExecutionStarted:
    case WorkflowEvent.LoopExecutionCompleted:
      return 'loop'

    case WorkflowEvent.RouterExecutionStarted:
    case WorkflowEvent.RouterExecutionCompleted:
      return 'replace'

    case WorkflowEvent.StepsExecutionStarted:
    case WorkflowEvent.StepsExecutionCompleted:
      return 'divider-vertical'

    case RunEvent.ToolCallStarted:
    case TeamRunEvent.TeamToolCallStarted:
    case RunEvent.ToolCallCompleted:
    case TeamRunEvent.TeamToolCallCompleted:
      return 'hammer'

    case RunEvent.RunStarted:
    case TeamRunEvent.TeamRunStarted:
      return 'run'

    case RunEvent.RunContent:
    case TeamRunEvent.TeamRunContent:
      return 'messages-square'

    case RunEvent.RunCompleted:
    case TeamRunEvent.TeamRunCompleted:
      return 'check-circle-2'

    default:
      return 'dot'
  }
}

export function getLabelForEvent(evt: WorkflowRealtimeEvent): {
  tooltip: string
  primary: string
  badge?: string
} {
  const e = evt.event
  switch (e) {
    case WorkflowEvent.WorkflowStarted:
      return { tooltip: 'Workflow', primary: 'Workflow started' }

    case WorkflowEvent.WorkflowCompleted:
      return { tooltip: 'Workflow', primary: 'Workflow completed' }

    case WorkflowEvent.WorkflowFailed:
      return { tooltip: 'Workflow', primary: 'Workflow failed' }

    case WorkflowEvent.StepStarted:
      return {
        tooltip: 'Step',
        primary: `Step started: ${evt.step_name || evt.step_id || ''}`
      }

    case WorkflowEvent.StepCompleted:
      return {
        tooltip: 'Step',
        primary: `Step completed: ${evt.step_name || evt.step_id || ''}`
      }

    case WorkflowEvent.ParallelExecutionStarted:
      return { tooltip: 'Parallel', primary: 'Parallel started' }

    case WorkflowEvent.ParallelExecutionCompleted:
      return { tooltip: 'Parallel', primary: 'Parallel completed' }

    case WorkflowEvent.ConditionExecutionStarted:
      return { tooltip: 'Condition', primary: 'Condition started' }

    case WorkflowEvent.ConditionExecutionCompleted:
      return { tooltip: 'Condition', primary: 'Condition completed' }

    case WorkflowEvent.LoopExecutionStarted:
      return { tooltip: 'Loop', primary: 'Loop started' }

    case WorkflowEvent.LoopExecutionCompleted:
      return { tooltip: 'Loop', primary: 'Loop completed' }

    case WorkflowEvent.RouterExecutionStarted:
      return { tooltip: 'Router', primary: 'Router started' }

    case WorkflowEvent.RouterExecutionCompleted:
      return { tooltip: 'Router', primary: 'Router completed' }

    case WorkflowEvent.StepsExecutionStarted:
      return { tooltip: 'Steps', primary: 'Steps started' }

    case WorkflowEvent.StepsExecutionCompleted:
      return { tooltip: 'Steps', primary: 'Steps completed' }

    case RunEvent.ToolCallStarted:
    case TeamRunEvent.TeamToolCallStarted:
      return {
        tooltip: 'Tool Call',
        primary: `Tool call started: ${evt.tool?.tool_name ?? ''}`
      }

    case RunEvent.ToolCallCompleted:
    case TeamRunEvent.TeamToolCallCompleted:
      return {
        tooltip: 'Tool Call',
        primary: `Tool call completed: ${evt.tool?.tool_name ?? ''}`
      }

    case RunEvent.RunStarted: {
      const who = evt.agent_name
      const name = who ? ` by ${who}` : ''
      return { tooltip: 'Run', primary: `Run started${name}` }
    }

    case TeamRunEvent.TeamRunStarted: {
      const who = evt.team_name
      const name = who ? ` by ${who}` : ''
      return { tooltip: 'Run', primary: `Team started${name}` }
    }

    case RunEvent.RunContent:
    case TeamRunEvent.TeamRunContent:
      return { tooltip: 'Run', primary: 'Run content' }

    case RunEvent.RunCompleted:
    case TeamRunEvent.TeamRunCompleted:
      if (evt.team_name)
        return { tooltip: 'Run', primary: `${evt.team_name}: run completed` }
      if (evt.agent_name)
        return { tooltip: 'Run', primary: `${evt.agent_name}: run completed` }
      return { tooltip: 'Run', primary: 'Run completed' }

    default:
      return { tooltip: 'Event', primary: e }
  }
}

export function formatPrimaryText(primary: string): string {
  return primary
}

export function mapWorkflowToolToAgentTool(
  tool?: WorkflowToolCall
): AgentToolCall | undefined {
  if (!tool) return undefined
  return {
    tool_call_id: tool.tool_call_id,
    tool_name: tool.tool_name,
    tool_args: tool.tool_args as unknown as Record<string, string>,
    tool_call_error: tool.tool_call_error,
    created_at: tool.created_at,
    result: tool.result,
    stop_after_tool_call: tool.stop_after_tool_call,
    requires_confirmation: tool.requires_confirmation ?? undefined,
    confirmed: tool.confirmed ?? undefined,
    requires_user_input: tool.requires_user_input ?? undefined,
    user_input_schema: undefined,
    answered: tool.answered ?? undefined,
    external_execution_required: tool.external_execution_required ?? undefined
  }
}

export function isToolEvent(event: string): boolean {
  return (
    event === RunEvent.ToolCallStarted ||
    event === TeamRunEvent.TeamToolCallStarted ||
    event === RunEvent.ToolCallCompleted ||
    event === TeamRunEvent.TeamToolCallCompleted
  )
}

export function isToolCompleted(evt: WorkflowRealtimeEvent): boolean {
  const toolCompletedFlag = (evt as unknown as { tool_completed?: boolean })
    .tool_completed
  return (
    Boolean(toolCompletedFlag) ||
    evt.event === RunEvent.ToolCallCompleted ||
    evt.event === TeamRunEvent.TeamToolCallCompleted
  )
}

export function isRunTerminal(event: string): boolean {
  return (
    event === RunEvent.RunCompleted || event === TeamRunEvent.TeamRunCompleted
  )
}

export function isRunStart(event: string): boolean {
  return event === RunEvent.RunStarted || event === TeamRunEvent.TeamRunStarted
}

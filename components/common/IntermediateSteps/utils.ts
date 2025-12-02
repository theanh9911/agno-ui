import {
  IntermediateStep,
  ReasoningStepContent,
  RunEvent,
  TeamRunEvent
} from '@/types/playground'
import { ToolCall } from '@/types/Agent'
import { formatTimeInSeconds } from '@/utils/format'

// Helper function to get event type
export const getEventType = (eventName: string): string => {
  if (eventName.includes(RunEvent.RunStarted)) return RunEvent.RunStarted
  if (eventName.includes(RunEvent.RunCompleted)) return RunEvent.RunCompleted
  if (eventName.includes(RunEvent.RunError)) return RunEvent.RunError
  if (eventName.includes(RunEvent.RunCancelled)) return RunEvent.RunCancelled
  if (eventName.includes(RunEvent.RunContent)) return RunEvent.RunContent
  if (eventName.includes('ToolCall')) return 'ToolCall'
  if (eventName.includes(RunEvent.ReasoningStarted))
    return RunEvent.ReasoningStarted
  if (eventName.includes(RunEvent.ReasoningStep)) return RunEvent.ReasoningStep
  if (eventName.includes(RunEvent.ReasoningCompleted))
    return RunEvent.ReasoningCompleted
  if (eventName.includes(RunEvent.MemoryUpdateStarted))
    return RunEvent.MemoryUpdateStarted
  if (eventName.includes(RunEvent.MemoryUpdateCompleted))
    return RunEvent.MemoryUpdateCompleted
  if (eventName.includes('UpdatingMemory'))
    return RunEvent.MemoryUpdateCompleted // Legacy event from older SDK
  if (eventName.includes('MemoryUpdate')) return 'MemoryUpdate'
  return 'Unknown'
}

// Helper function to extract base ID from step ID
export const getBaseId = (stepId: string, eventType: string) => {
  const prefixes = eventType.includes('ToolCall')
    ? [
        `${RunEvent.ToolCallStarted}_`,
        `${RunEvent.ToolCallCompleted}_`,
        `${TeamRunEvent.TeamToolCallStarted}_`,
        `${TeamRunEvent.TeamToolCallCompleted}_`
      ]
    : eventType.includes('MemoryUpdate')
      ? [
          `${RunEvent.MemoryUpdateStarted}_`,
          `${RunEvent.MemoryUpdateCompleted}_`,
          `${TeamRunEvent.TeamMemoryUpdateStarted}_`,
          `${TeamRunEvent.TeamMemoryUpdateCompleted}_`
        ]
      : [
          `${RunEvent.ReasoningStarted}_`,
          `${RunEvent.ReasoningStep}_`,
          `${RunEvent.ReasoningCompleted}_`
        ]

  return prefixes.reduce((id, prefix) => id.replace(prefix, ''), stepId)
}

// Helper function to get agent info from step
export const getAgentInfo = (step: IntermediateStep): string | null => {
  const originalChunk = step.data.originalChunk
  if (originalChunk?.team_id) {
    return originalChunk.team_name || originalChunk.team_id
  }
  if (originalChunk?.agent_id && !step.event.includes('Team')) {
    return originalChunk.agent_name || originalChunk.agent_id
  }
  return null
}

// Helper function to extract reasoning data from the correct location
export const getReasoningData = (
  step: IntermediateStep
): ReasoningStepContent[] => {
  const originalChunk = step.data.originalChunk

  // Check originalChunk.reasoning_steps (accumulated steps)
  if (
    originalChunk?.reasoning_steps &&
    originalChunk.reasoning_steps.length > 0
  ) {
    return originalChunk.reasoning_steps
  }

  // Check originalChunk.content.reasoning_steps (for ReasoningCompleted events)
  const content = originalChunk?.content
  if (content && typeof content === 'object' && 'reasoning_steps' in content) {
    return (content?.reasoning_steps as ReasoningStepContent[]) || []
  }

  // Check for ReasoningStep events - they have content directly as ReasoningStepContent
  if (
    step.event.includes('ReasoningStep') &&
    content &&
    typeof content === 'object'
  ) {
    // ReasoningStep events have their content as a single ReasoningStepContent object
    return [content as ReasoningStepContent]
  }

  return []
}

// Helper function to get tool calls from step
export const getToolCalls = (step: IntermediateStep): ToolCall[] => {
  const originalChunk = step.data.originalChunk
  if (!originalChunk) return []

  // Check for single tool call
  if (originalChunk.tool) {
    return [originalChunk.tool]
  }

  // Check for multiple tool calls
  if (originalChunk.tools && originalChunk.tools.length > 0) {
    return originalChunk.tools
  }

  return []
}

// Helper function to get error content from step
export const getErrorContent = (step: IntermediateStep): string => {
  const content = step.data.originalChunk?.content
  if (typeof content === 'string') {
    return `Run Error: ${content}`
  }
  if (content instanceof Error) {
    return `Run Error: ${content.message}`
  }
  return 'Something went wrong'
}

// Helper function to get cancellation reason from step
export const getCancellationReason = (step: IntermediateStep): string => {
  const originalChunk = step.data.originalChunk
  if (originalChunk && 'reason' in originalChunk && originalChunk.reason) {
    return `Run Cancelled: ${originalChunk.reason}`
  }
  return 'Run Cancelled'
}

// Event type helpers
export const eventTypeHelpers = {
  isToolCall: (eventType: string) => eventType.includes('ToolCall'),
  isMemoryUpdate: (eventType: string) => eventType.includes('MemoryUpdate'),
  isReasoning: (eventType: string) => eventType.includes('Reasoning'),
  isCompleted: (
    event: string,
    type: 'ToolCall' | 'Reasoning' | 'MemoryUpdate' | 'UpdatingMemory'
  ) => event.includes(`${type}Completed`) || event.includes('UpdatingMemory')
}

// Helper function to handle event deduplication
export const handleEventDeduplication = (
  acc: IntermediateStep[],
  step: IntermediateStep,
  eventType: string
) => {
  const baseId = getBaseId(step.id, eventType)
  const existingIndex = acc.findIndex((existingStep) => {
    const searchType = eventTypeHelpers.isToolCall(eventType)
      ? 'ToolCall'
      : eventTypeHelpers.isMemoryUpdate(eventType)
        ? 'MemoryUpdate'
        : 'Reasoning'

    if (!existingStep.event.includes(searchType)) return false

    const existingBaseId = getBaseId(
      existingStep.id,
      getEventType(existingStep.event)
    )
    return existingBaseId === baseId
  })

  if (eventTypeHelpers.isToolCall(eventType)) {
    if (existingIndex >= 0) {
      if (step.event.includes(RunEvent.ToolCallCompleted)) {
        acc[existingIndex] = step
      }
    } else {
      acc.push(step)
    }
  } else if (eventTypeHelpers.isMemoryUpdate(eventType)) {
    if (existingIndex >= 0) {
      if (step.event.includes(RunEvent.MemoryUpdateCompleted)) {
        acc[existingIndex] = step
      }
    } else {
      acc.push(step)
    }
  } else if (eventTypeHelpers.isReasoning(eventType)) {
    const reasoningData = getReasoningData(step)

    if (step.event.includes(RunEvent.ReasoningCompleted)) {
      const normalizedStep = {
        ...step,
        data: {
          ...step.data,
          reasoning: reasoningData
        }
      }

      if (existingIndex >= 0) {
        const existingStep = acc[existingIndex]
        const existingReasoningData = getReasoningData(existingStep)

        // Replace if ReasoningCompleted has better content or existing is just ReasoningStarted
        if (
          existingStep.event.includes(RunEvent.ReasoningStarted) ||
          reasoningData.length >= existingReasoningData.length
        ) {
          acc[existingIndex] = normalizedStep
        }
      } else {
        acc.push(normalizedStep)
      }
    } else if (step.event.includes(RunEvent.ReasoningStep)) {
      if (existingIndex >= 0) {
        const existingStep = acc[existingIndex]
        // Only replace ReasoningCompleted if it has no content
        if (
          !existingStep.event.includes(RunEvent.ReasoningCompleted) ||
          reasoningData.length > getReasoningData(existingStep).length
        ) {
          acc[existingIndex] = step
        }
      } else {
        acc.push(step)
      }
    } else if (step.event.includes(RunEvent.ReasoningStarted)) {
      if (existingIndex === -1) {
        acc.push(step)
      }
    }
  } else if (eventType === RunEvent.RunCompleted) {
    const hasReasoningData =
      step.data.originalChunk?.reasoning_steps &&
      step.data.originalChunk?.reasoning_steps.length > 0

    if (hasReasoningData) {
      const agentId = step.data.originalChunk?.agent_id
      if (agentId) {
        const reasoningStepIndex = acc.findIndex(
          (existingStep) =>
            existingStep.event.includes('Reasoning') &&
            existingStep.data.originalChunk?.agent_id === agentId
        )
        if (reasoningStepIndex >= 0) {
          acc[reasoningStepIndex] = step
          return
        }
      }
    }
    acc.push(step)
  } else {
    acc.push(step)
  }
}

// Compute a concise label describing the current intermediate status for a set of steps
export const getIntermediateStepsLabel = (
  steps: IntermediateStep[] | undefined,
  isTeam: boolean
): string => {
  if (!steps || steps.length === 0) {
    return 'Behind the scenes'
  }

  const latest = steps[steps.length - 1]
  const eventType = getEventType(latest.event)

  const prefix = isTeam
    ? `${getAgentInfo(latest) ?? ''}${getAgentInfo(latest) ? ': ' : ''}`
    : ''

  // For team contexts, only consider the run as completed if any step is exactly TeamRunCompleted
  const isTeamCompleted = isTeam
    ? steps.some((s) => s.event === TeamRunEvent.TeamRunCompleted)
    : false

  switch (eventType) {
    case RunEvent.RunStarted:
      return `${prefix}Working...`

    case RunEvent.RunCompleted: {
      // In team mode, suppress individual agent completion labels until the team run is completed
      if (isTeam && !isTeamCompleted) {
        return `${prefix}Working...`
      }
      const chunk = latest?.data?.originalChunk
      const durationFromMetrics =
        chunk?.metrics?.duration ??
        (chunk?.messages || [])?.find?.((m) => m?.role === 'metrics')?.metrics
          ?.duration

      if (typeof durationFromMetrics === 'number') {
        const smaller = formatTimeInSeconds(durationFromMetrics)
        return `Worked for ${smaller.value} ${smaller.unit}`
      }
      return `${prefix}Completed`
    }
    case RunEvent.RunError:
      return `${prefix}${getErrorContent(latest)}`

    case RunEvent.RunCancelled:
      return `${prefix}${getCancellationReason(latest)}`

    case 'ToolCall': {
      const isCompleted = eventTypeHelpers.isCompleted(latest.event, 'ToolCall')
      const tools = getToolCalls(latest)
      const name = tools[0]?.tool_name || 'Tool call'
      return isCompleted
        ? `${prefix}Tool call completed: ${name}`
        : `${prefix} Calling tool: ${name}`
    }

    case RunEvent.ReasoningStarted:
    case RunEvent.ReasoningStep:
      return `${prefix}Reasoning...`

    case RunEvent.ReasoningCompleted:
      return `${prefix}Reasoning completed!`

    case RunEvent.MemoryUpdateStarted:
    case 'MemoryUpdate':
      return `${prefix}Updating memory...`

    case RunEvent.MemoryUpdateCompleted:
      return `${prefix}Memory updated!`

    default:
      return `${prefix}Working...`
  }
}

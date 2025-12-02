import { RunResponseContent } from '@/types/Agent'

/**
 * Event type checking utilities
 */
export const eventCheckers = {
  isStartedEvent: (event: string): boolean =>
    event.includes('RunStarted') || event.includes('TeamRunStarted'),

  isCompletedEvent: (event: string): boolean =>
    event.includes('RunCompleted') || event.includes('TeamRunCompleted'),

  isContentEvent: (event: string): boolean =>
    event.includes('RunContent') ||
    event.includes('RunOutput') ||
    event.includes('TeamRunContent'),

  isReasoningEvent: (event: string): boolean =>
    event.includes('ReasoningCompleted') || event.includes('ReasoningStep'),

  isToolCallEvent: (event: string): boolean =>
    event.includes('ToolCallStarted') || event.includes('ToolCallCompleted'),

  isMemoryEvent: (event: string): boolean => event.includes('MemoryUpdate')
}

/**
 * Event key generation utilities
 */
export const eventKeyUtils = {
  getAgentIdentifier: (chunk: RunResponseContent): string =>
    chunk?.agent_id || chunk?.team_id || '',

  generateEventKey: (chunk: RunResponseContent, suffix?: string): string => {
    const identifier = eventKeyUtils.getAgentIdentifier(chunk)
    const keySuffix = suffix || identifier
    return `${chunk.event}_${keySuffix}`
  }
}

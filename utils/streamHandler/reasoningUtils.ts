import { RunResponseContent, Metrics } from '@/types/Agent'
import { ReasoningMessage, ReasoningStepContent } from '@/types/playground'

/**
 * Reasoning processing utilities
 */
export const reasoningUtils = {
  /**
   * Extracts reasoning metrics from the last reasoning message
   */
  extractReasoningMetrics: (
    reasoningMessages: ReasoningMessage[] = []
  ): Metrics | null => {
    const lastReasoningMessage =
      reasoningMessages.length > 0
        ? reasoningMessages[reasoningMessages.length - 1]
        : null

    if (lastReasoningMessage?.metrics?.duration) {
      return {
        duration: lastReasoningMessage.metrics.duration
      }
    }

    return null
  },

  /**
   * Extracts reasoning data from chunk
   */
  extractReasoningData: (chunk: RunResponseContent): ReasoningStepContent[] => {
    // Check chunk.content.reasoning_steps first (for ReasoningCompleted events)
    if (
      chunk.content &&
      typeof chunk.content === 'object' &&
      'reasoning_steps' in chunk.content
    ) {
      return (chunk?.content?.reasoning_steps as ReasoningStepContent[]) || []
    }

    // Fallback to chunk.reasoning_steps
    if (chunk.reasoning_steps) {
      return chunk.reasoning_steps
    }

    return []
  },

  /**
   * Processes a reasoning step content object
   */
  processReasoningStep: (
    content: ReasoningStepContent
  ): ReasoningStepContent | null => {
    if (typeof content === 'object' && content !== null) {
      return {
        title: content.title,
        action: content.action || '',
        result: content.result || '',
        reasoning: content.reasoning || '',
        next_action: content.next_action || '',
        confidence: content.confidence || 0
      }
    }
    return null
  },

  /**
   * Checks if an event is reasoning-related
   */
  isReasoningRelatedEvent: (event: string): boolean => {
    return event.includes('Reasoning')
  }
}

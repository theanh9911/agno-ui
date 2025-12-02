import { RunResponseContent } from '@/types/Agent'
import { IntermediateStep, ReasoningStepContent } from '@/types/playground'
import { eventCheckers, eventKeyUtils } from './eventUtils'
import { contentUtils } from './contentUtils'

/**
 * Intermediate steps management utilities
 */
export const intermediateStepsUtils = {
  /**
   * Handles content updates for intermediate steps
   */
  handleIntermediateStepContentUpdate: (
    existingChunk: RunResponseContent,
    newChunk: RunResponseContent,
    lastContent: string
  ): { updatedChunk: RunResponseContent; newLastContent: string } => {
    const updatedChunk = { ...existingChunk }
    const existingContent =
      typeof existingChunk.content === 'string' ? existingChunk.content : ''

    const { newContent, newLastContent, newAudio } =
      contentUtils.processContentChunk(
        newChunk,
        lastContent,
        existingContent,
        existingChunk.response_audio
      )

    // Update content and audio based on processed results
    updatedChunk.content = newContent
    if (newAudio) {
      updatedChunk.response_audio = {
        ...updatedChunk.response_audio,
        ...newAudio
      }
    }

    // Only apply additional updates for string content
    if (typeof newChunk?.content === 'string') {
      updatedChunk.created_at = newChunk.created_at ?? existingChunk.created_at

      // Update reasoning-related data for display
      if (newChunk.reasoning_steps) {
        updatedChunk.reasoning_steps = newChunk.reasoning_steps
      }

      if (newChunk.reasoning_messages) {
        updatedChunk.reasoning_messages = newChunk.reasoning_messages
      }

      // Handle media files for intermediate step display
      if (newChunk.images) updatedChunk.images = newChunk.images
    }

    return { updatedChunk, newLastContent }
  },

  /**
   * Handles reasoning step events specifically
   */
  handleReasoningStepEvent: (
    intermediateSteps: IntermediateStep[],
    eventKey: string,
    chunk: RunResponseContent,
    identifier: string
  ): IntermediateStep[] => {
    const agentEvents = intermediateSteps.filter(
      (step) =>
        step.id.includes(identifier) && step.event.includes('ReasoningStep')
    )
    const lastReasoningStepEvent = agentEvents.at(-1)

    if (lastReasoningStepEvent?.data.originalChunk) {
      // Find the index of the last reasoning step event
      const lastReasoningIndex = intermediateSteps.indexOf(
        lastReasoningStepEvent
      )
      const updatedSteps = [...intermediateSteps]

      // Get existing reasoning steps
      const existingReasoningSteps =
        lastReasoningStepEvent.data.originalChunk.reasoning_steps || []

      // Extract new reasoning step from chunk content
      const SheetReasoningStep = chunk.content as ReasoningStepContent

      // Accumulate reasoning steps
      const accumulatedSteps = [...existingReasoningSteps, SheetReasoningStep]

      // Update the existing reasoning step with accumulated data
      const updatedChunk = {
        ...lastReasoningStepEvent.data.originalChunk,
        reasoning_steps: accumulatedSteps
      }

      updatedSteps[lastReasoningIndex] = {
        ...lastReasoningStepEvent,
        data: { originalChunk: updatedChunk }
      }

      return updatedSteps
    }

    // If no existing reasoning step event, create new one
    return [
      ...intermediateSteps,
      {
        event: chunk.event,
        id: eventKey,
        data: {
          originalChunk: {
            ...chunk,
            reasoning_steps: [chunk.content as ReasoningStepContent]
          }
        }
      }
    ]
  },

  /**
   * Handles content events for intermediate steps
   */
  handleContentEvent: (
    intermediateSteps: IntermediateStep[],
    eventKey: string,
    chunk: RunResponseContent,
    identifier: string
  ): IntermediateStep[] => {
    const agentEvents = intermediateSteps.filter((step) =>
      step.id.includes(identifier)
    )
    const lastAgentEvent = agentEvents.at(-1)

    if (lastAgentEvent) {
      // Case 1: Last event is Content - append to it if no Completed after it
      if (eventCheckers.isContentEvent(lastAgentEvent.event)) {
        const hasCompletedAfter = intermediateSteps
          .slice(intermediateSteps.indexOf(lastAgentEvent) + 1)
          .some(
            (step) =>
              step.id.includes(identifier) &&
              eventCheckers.isCompletedEvent(step.event)
          )

        if (!hasCompletedAfter && lastAgentEvent.data.originalChunk) {
          const lastStepIndex = intermediateSteps.indexOf(lastAgentEvent)
          const updatedSteps = [...intermediateSteps]
          const lastContent =
            typeof lastAgentEvent.data.originalChunk.content === 'string'
              ? lastAgentEvent.data.originalChunk.content
              : ''

          const { updatedChunk } =
            intermediateStepsUtils.handleIntermediateStepContentUpdate(
              lastAgentEvent.data.originalChunk,
              chunk,
              lastContent
            )

          updatedSteps[lastStepIndex] = {
            ...lastAgentEvent,
            data: { originalChunk: updatedChunk }
          }
          return updatedSteps
        }
      }

      // Case 2: Last event is Started with no Content/Completed after it
      if (eventCheckers.isStartedEvent(lastAgentEvent.event)) {
        const hasContentOrCompletedAfter = intermediateSteps
          .slice(intermediateSteps.indexOf(lastAgentEvent) + 1)
          .some(
            (step) =>
              step.id.includes(identifier) &&
              (eventCheckers.isContentEvent(step.event) ||
                eventCheckers.isCompletedEvent(step.event))
          )

        if (!hasContentOrCompletedAfter) {
          const processedChunk =
            contentUtils.processChunkForIntermediateSteps(chunk)

          return [
            ...intermediateSteps,
            {
              event: chunk.event,
              id: eventKey,
              data: { originalChunk: processedChunk }
            }
          ]
        }
      }
    }

    return intermediateSteps
  },

  /**
   * Main function to update or add intermediate step
   */
  updateIntermediateStep: (
    intermediateSteps: IntermediateStep[],
    eventKey: string,
    chunk: RunResponseContent
  ): IntermediateStep[] => {
    const identifier = eventKeyUtils.getAgentIdentifier(chunk)

    // Special handling for ReasoningStep events
    if (chunk.event.includes('ReasoningStep')) {
      return intermediateStepsUtils.handleReasoningStepEvent(
        intermediateSteps,
        eventKey,
        chunk,
        identifier
      )
    }

    // For Started events, check if we need to create a new entry
    if (eventCheckers.isStartedEvent(chunk.event)) {
      const agentEvents = intermediateSteps.filter((step) =>
        step.id.includes(identifier)
      )
      const lastAgentEvent = agentEvents.at(-1)

      // Only add new Started if last event was Completed
      if (
        !lastAgentEvent ||
        eventCheckers.isCompletedEvent(lastAgentEvent.event)
      ) {
        return [
          ...intermediateSteps,
          {
            event: chunk.event,
            id: eventKey,
            data: { originalChunk: chunk }
          }
        ]
      }
      return intermediateSteps
    }

    // For Content events
    if (eventCheckers.isContentEvent(chunk.event)) {
      return intermediateStepsUtils.handleContentEvent(
        intermediateSteps,
        eventKey,
        chunk,
        identifier
      )
    }

    // For Completed events
    if (eventCheckers.isCompletedEvent(chunk.event)) {
      const agentEvents = intermediateSteps.filter((step) =>
        step.id.includes(identifier)
      )

      const lastRunEvent = agentEvents
        .filter(
          (step) =>
            eventCheckers.isStartedEvent(step.event) ||
            eventCheckers.isContentEvent(step.event)
        )
        .at(-1)

      if (lastRunEvent) {
        const hasCompletedAfter = intermediateSteps
          .slice(intermediateSteps.indexOf(lastRunEvent) + 1)
          .some(
            (step) =>
              step.id.includes(identifier) &&
              eventCheckers.isCompletedEvent(step.event)
          )

        if (!hasCompletedAfter) {
          return [
            ...intermediateSteps,
            {
              event: chunk.event,
              id: eventKey,
              data: { originalChunk: chunk }
            }
          ]
        }
      }
      return intermediateSteps
    }

    // Default case: just add the event
    return [
      ...intermediateSteps,
      {
        event: chunk.event,
        id: eventKey,
        data: { originalChunk: chunk }
      }
    ]
  }
}

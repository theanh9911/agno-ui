import { RunResponseContent } from '@/types/Agent'
import { RunEvent, TeamRunEvent, IntermediateStep } from '@/types/playground'
import { eventCheckers, eventKeyUtils } from './eventUtils'

/**
 * Session-specific event processing utilities
 */
export const sessionEventUtils = {
  /**
   * Creates event data structure from a session event
   */
  createEventData: (event: RunResponseContent): RunResponseContent => ({
    run_id: event.run_id,
    parent_run_id: event.parent_run_id,
    content: event.content,
    run_response_format: event.run_response_format,
    run_input: event.run_input,
    reasoning_content: event.reasoning_content,
    reasoning_steps: event.reasoning_steps,
    metrics: event.metrics,
    messages: event.messages,
    event: event.event,
    events: event.events,
    status: event.status,
    event_data: event.event_data,
    model: event.model,
    agent_id: event.agent_id,
    team_id: event.team_id,
    team_name: event.team_name,
    agent_name: event.agent_name,
    session_id: event.session_id,
    content_type: event.content_type || 'str',
    tools: event.tools,
    tool: event.tool,
    extra_data: event.extra_data,
    images: event.images,
    videos: event.videos,
    audio: event.audio,
    response_audio: event.response_audio,
    reasoning_messages: event.reasoning_messages
  }),

  /**
   * Processes a single event into intermediate steps
   */
  processEventToIntermediateSteps: (
    event: RunResponseContent
  ): IntermediateStep[] => {
    const identifier = eventKeyUtils.getAgentIdentifier(event)
    const eventKeySuffix = event?.tool?.tool_call_id || identifier
    const baseId = eventKeyUtils.generateEventKey(event, eventKeySuffix)
    const eventData = sessionEventUtils.createEventData(event)

    // Handle RunCompleted and TeamRunCompleted events specially
    if (eventCheckers.isCompletedEvent(event.event)) {
      // Create RunResponseContent event first, then Completed event
      const contentEventData: RunResponseContent = {
        run_id: event.run_id,
        parent_run_id: event.parent_run_id,
        content: event.content,
        run_response_format: event.run_response_format,
        run_input: event.run_input,
        reasoning_content: event.reasoning_content,
        reasoning_steps: event.reasoning_steps,
        metrics: event.metrics,
        messages: event.messages,
        event: event.team_id
          ? TeamRunEvent.TeamRunContent
          : RunEvent.RunContent,
        events: event.events,
        status: event.status,
        event_data: event.event_data,
        model: event.model,
        agent_id: event.agent_id,
        team_id: event.team_id,
        team_name: event.team_name,
        agent_name: event.agent_name,
        session_id: event.session_id,
        content_type: event.content_type || 'str',
        tools: event.tools,
        tool: event.tool,
        extra_data: event.extra_data,
        images: event.images,
        response_audio: event.response_audio,
        reasoning_messages: event.reasoning_messages
      }

      return [
        {
          event: contentEventData.event,
          id: `${contentEventData.event}_${eventKeySuffix}`,
          data: {
            originalChunk: contentEventData
          }
        },
        {
          event: event.event,
          id: baseId,
          data: {
            originalChunk: eventData
          }
        }
      ]
    }

    // Default case: single event
    return [
      {
        event: event.event,
        id: baseId,
        data: {
          originalChunk: eventData
        }
      }
    ]
  },

  /**
   * Processes all events from a run into intermediate steps
   */
  processRunEvents: (
    events?: RunResponseContent[] | null
  ): IntermediateStep[] => {
    const safeEvents = Array.isArray(events) ? events : []
    if (safeEvents.length === 0) {
      return []
    }
    return safeEvents.flatMap(sessionEventUtils.processEventToIntermediateSteps)
  }
}

import {
  IntermediateStep,
  PlaygroundMessage,
  ReasoningMessage,
  ReasoningStepContent
} from '@/types/playground'
import { RunResponseContent, ToolCall } from '@/types/Agent'
import { getJsonMarkdown } from '@/utils/playgroundUtils'

/**
 * Message processing utilities for session data
 */
export const messageUtils = {
  /**
   * Processes tool calls from reasoning messages into ToolCall format
   */
  processReasoningToolCalls: (
    reasoningMessages: ReasoningMessage[] = []
  ): ToolCall[] => {
    return reasoningMessages.reduce((acc: ToolCall[], msg) => {
      if (msg.role === 'tool') {
        acc.push({
          role: msg.role,
          content: msg.content,
          tool_call_id: msg.tool_call_id,
          tool_name: msg.tool_name,
          tool_args: msg.tool_args,
          tool_call_error: !!msg.tool_call_error,
          metrics: msg.metrics,
          created_at: msg.created_at
        } as ToolCall)
      }
      return acc
    }, [])
  },

  /**
   * Creates a user message from run input
   */
  createUserMessage: (run: RunResponseContent): PlaygroundMessage => ({
    role: 'user',
    run_id: run.run_id,
    content: run.run_input ?? '',
    created_at: run.created_at ?? '',
    images: run?.input_media?.images,
    videos: run?.input_media?.videos,
    audios: run?.input_media?.audios
  }),

  /**
   * Creates a paused agent message with dynamic content
   */
  createPausedAgentMessage: (
    content: string | object | undefined,
    tools: ToolCall[] = [],
    createdAt: string | number,
    runId: string = ''
  ): PlaygroundMessage => ({
    role: 'agent',
    run_id: runId,
    dynamicContent:
      typeof content === 'string' ? content : JSON.stringify(content),
    tools,
    created_at: createdAt,
    content: ''
  }),

  /**
   * Creates a completed agent message with all data
   */
  createCompletedAgentMessage: (
    run: RunResponseContent,
    toolCalls: ToolCall[],
    reasoningSteps: ReasoningStepContent[],
    intermediateSteps: IntermediateStep[]
  ): PlaygroundMessage => ({
    role: 'agent',
    run_id: run.run_id,
    content: run.content as string,
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
    extra_data: run.extra_data,
    images: run.images,
    videos: run.videos,
    audios: run.audio,
    tools: run.tools,
    response_audio: run.response_audio,
    created_at: run.created_at ?? '',
    reasoning: reasoningSteps,
    intermediateSteps:
      intermediateSteps.length > 0 ? intermediateSteps : undefined,
    agent_name: run.agent_name,
    team_name: run.team_name,
    references: run?.references ?? [],
    metrics: run?.metrics ?? {},
    session_state: run?.session_state ?? {}
  }),

  /**
   * Processes final message content formatting
   */
  processMessageContent: (message: PlaygroundMessage): PlaygroundMessage => {
    // Handle array content (extract text)
    if (Array.isArray(message.content)) {
      const textContent = message.content
        .filter((item: { type: string }) => item?.type === 'text')
        .map((item) => item.text)
        .join(' ')

      return {
        ...message,
        content: textContent
      }
    }

    // Handle object content (convert to JSON markdown)
    if (typeof message.content !== 'string') {
      return {
        ...message,
        content: getJsonMarkdown(message.content),
        tools: message.tools
      }
    }

    // Return as-is for string content
    return message
  }
}

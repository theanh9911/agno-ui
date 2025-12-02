import { RunResponseContent } from '@/types/Agent'
import { PlaygroundMessage, ReasoningStepContent } from '@/types/playground'
import { reasoningUtils } from './reasoningUtils'
import { toolUtils } from './toolUtils'
import { contentUtils } from './contentUtils'

/**
 * Event-specific processors for different types of stream events
 */
export const eventProcessors = {
  /**
   * Process run started events
   */
  processRunStarted: (
    chunk: RunResponseContent,
    setReasoningStreaming: () => void
  ): void => {
    setReasoningStreaming()
  },

  /**
   * Process reasoning step events
   */
  processReasoningStep: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void
  ): void => {
    const content = chunk.content as ReasoningStepContent
    const processedStep = reasoningUtils.processReasoningStep(content)

    if (processedStep) {
      updateMessage((message) => ({
        ...message,
        reasoning: [...(message.reasoning || []), processedStep]
      }))
    }
  },

  /**
   * Process reasoning completed events
   */
  processReasoningCompleted: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void
  ): void => {
    const reasoningSteps = reasoningUtils.extractReasoningData(chunk)

    updateMessage((message) => {
      const updatedMessage = { ...message, is_reasoning_streaming: false }

      if (reasoningSteps.length > 0) {
        updatedMessage.reasoning = reasoningSteps
      }

      // Update reasoning data directly on message
      const reasoningMetrics = reasoningUtils.extractReasoningMetrics(
        chunk.reasoning_messages
      )

      // Set reasoning data directly on message
      if (reasoningSteps.length > 0) {
        updatedMessage.reasoning_steps = reasoningSteps
      }

      if (chunk.reasoning_messages) {
        updatedMessage.reasoning_messages = chunk.reasoning_messages
      }

      if (chunk.references) {
        updatedMessage.references = chunk.references
      }

      updatedMessage.extra_data = {
        ...updatedMessage.extra_data,
        ...(reasoningMetrics && { reasoning_metrics: reasoningMetrics })
      }

      // Handle media files
      if (chunk.images) updatedMessage.images = chunk.images
      if (chunk.videos) updatedMessage.videos = chunk.videos
      if (chunk.audio) updatedMessage.audio = chunk.audio

      return updatedMessage
    })
  },

  /**
   * Process run continued events
   */
  processRunContinued: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void
  ): void => {
    if (chunk.tools && chunk.tools.length > 0) {
      updateMessage((message) => ({
        ...message,
        disableHitlForm: true
      }))
    }
  },

  /**
   * Process run paused events
   */
  processRunPaused: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void,
    setRunId: (id: string | null) => void,
    isTeams: boolean
  ): void => {
    let updatedContent: string

    if (typeof chunk.content === 'string') {
      updatedContent = chunk.content
    } else {
      try {
        updatedContent = JSON.stringify(chunk.content)
      } catch {
        updatedContent = 'Error parsing response'
      }
    }

    if (!isTeams) {
      setRunId(chunk.run_id || null)
    }

    updateMessage((message) => {
      const updatedMessage = {
        ...message,
        disableHitlForm: false,
        is_reasoning_streaming: false
      }

      if (chunk.content) {
        updatedMessage.dynamicContent = updatedContent
      }

      if (chunk.tools && chunk.tools.length > 0) {
        updatedMessage.tools = toolUtils.formatToolsForHITL(chunk.tools)
      } else {
        updatedMessage.tools = []
      }

      return updatedMessage
    })
  },

  /**
   * Process run completed events
   */
  processRunCompleted: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void,
    isTeams: boolean,
    onRunCompleted?: (sessionId: string) => void
  ): void => {
    updateMessage((message) => {
      const reasoningMetrics = reasoningUtils.extractReasoningMetrics(
        chunk.reasoning_messages
      )

      // Process content using contentUtils to handle any content type
      let processedContent = message.content
      if (chunk.content !== undefined) {
        if (typeof chunk.content === 'string') {
          processedContent = chunk.content
        } else if (
          typeof chunk.content === 'object' &&
          chunk.content !== null
        ) {
          const { newContent } = contentUtils.processContentChunk(chunk, '', '')
          processedContent = newContent
        }
      }

      return {
        ...message,
        content: processedContent,
        tool_calls: toolUtils.processChunkToolCalls(
          chunk,
          message.tool_calls,
          isTeams
        ),
        created_at: chunk.created_at ?? message.created_at,
        disableHitlForm: true,
        images: chunk.images ?? message.images,
        videos: chunk.videos ?? message.videos,
        audio: chunk.audio ?? message.audio,
        response_audio: chunk.response_audio ?? message.response_audio,
        reasoning_steps: chunk.reasoning_steps ?? message.reasoning_steps,
        reasoning_messages:
          chunk.reasoning_messages ?? message.reasoning_messages,
        references: chunk.references ?? message.references,
        extra_data: {
          ...message.extra_data,
          reasoning_metrics:
            reasoningMetrics ?? message.extra_data?.reasoning_metrics
        }
      }
    })

    // Trigger session state fetch after run completion
    if (onRunCompleted && chunk.session_id) {
      onRunCompleted(chunk.session_id)
    }
  },

  /**
   * Process tool call events
   */
  processToolCallEvent: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void,
    isTeams: boolean
  ): void => {
    updateMessage((message) => ({
      ...message,
      tool_calls: toolUtils.processChunkToolCalls(
        chunk,
        message.tool_calls,
        isTeams
      )
    }))
  },

  /**
   * Process content events
   */
  processContentEvent: (
    chunk: RunResponseContent,
    updateMessage: (
      updater: (msg: PlaygroundMessage) => PlaygroundMessage
    ) => void
  ): void => {
    updateMessage((message) => contentUtils.handleContentUpdate(message, chunk))
  }
}

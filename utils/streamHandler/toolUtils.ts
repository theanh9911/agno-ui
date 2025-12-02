import { ToolCall, RunResponseContent } from '@/types/Agent'

/**
 * Tool processing utilities
 */
export const toolUtils = {
  /**
   * Processes a new tool call and adds it to the message
   */
  processToolCall: (
    toolCall: ToolCall,
    prevToolCalls: ToolCall[] = []
  ): ToolCall[] => {
    const toolCallId =
      toolCall.tool_call_id || `${toolCall.tool_name}-${toolCall.created_at}`

    const existingToolCallIndex = prevToolCalls.findIndex(
      (tc) =>
        (tc.tool_call_id && tc.tool_call_id === toolCall.tool_call_id) ||
        (!tc.tool_call_id &&
          toolCall.tool_name &&
          toolCall.created_at &&
          `${tc.tool_name}-${tc.created_at}` === toolCallId)
    )

    if (existingToolCallIndex >= 0) {
      const updatedToolCalls = [...prevToolCalls]
      updatedToolCalls[existingToolCallIndex] = {
        ...updatedToolCalls[existingToolCallIndex],
        ...toolCall
      }
      return updatedToolCalls
    } else {
      return [...prevToolCalls, toolCall]
    }
  },

  /**
   * Processes tool calls from a chunk, handling both single tool object and tools array formats
   */
  processChunkToolCalls: (
    chunk: RunResponseContent,
    existingToolCalls: ToolCall[] = [],
    isTeams: boolean = false
  ): ToolCall[] => {
    let updatedToolCalls = [...existingToolCalls]

    if ((isTeams && chunk?.team_id) || (!isTeams && chunk?.agent_id)) {
      // Handle new single tool object format
      if (chunk.tool) {
        updatedToolCalls = toolUtils.processToolCall(
          chunk.tool,
          updatedToolCalls
        )
      }

      // Handle legacy tools array format
      if (chunk.tools && chunk.tools.length > 0) {
        for (const toolCall of chunk.tools) {
          updatedToolCalls = toolUtils.processToolCall(
            toolCall,
            updatedToolCalls
          )
        }
      }
    }

    return updatedToolCalls
  },

  /**
   * Formats tools for HITL (Human in the Loop) interactions
   */
  formatToolsForHITL: (tools: ToolCall[]): ToolCall[] => {
    return tools.map((backendTool: ToolCall) => ({
      ...backendTool,
      user_input_schema:
        backendTool.user_input_schema?.map((field) => ({
          name: field.name,
          field_type: field.field_type,
          description: field.description,
          value: field.value
        })) || undefined,
      requires_user_input: backendTool.requires_user_input,
      requires_confirmation: backendTool.requires_confirmation,
      confirmed: backendTool.confirmed,
      answered: backendTool.answered
    }))
  }
}

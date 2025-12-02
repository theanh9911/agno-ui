import { useRef, type FC, useMemo } from 'react'
import React from 'react'

import { useSessionStore } from '@/stores/SessionsStore'

import type { RunProps } from './types'
import { ToolCall } from '@/types/Agent'
import { FormatType } from '@/components/pages/SessionsPage/types'
import DetailedRun from './DetailedRun'
import RunMainInfo from './RunMainInfo'

const Run: FC<RunProps> = ({ run, index, isTeam, isWorkflow }) => {
  const viewMode =
    useSessionStore((state) => state.viewMode) ?? FormatType.Formatted
  const isShowingDetails = useSessionStore((state) => state.isShowingDetails)

  const mainInfoRef = useRef<HTMLDivElement>(null)

  let allTools = run?.tools

  const messages = useMemo(() => {
    let processedMessages = [...(run.messages ?? [])]

    if (processedMessages.length > 0 && run?.reasoning_steps) {
      const userIndex = processedMessages?.findIndex((m) => m?.role === 'user')
      if (userIndex !== -1) {
        processedMessages = [
          ...processedMessages.slice(0, userIndex + 1),
          {
            role: 'reasoning',
            content: JSON.stringify(run?.reasoning_steps)
          },
          ...processedMessages.slice(userIndex + 1)
        ]
      }
    }

    if (processedMessages.length > 0 && run?.reasoning_messages) {
      const reasoningIndex = processedMessages.findIndex(
        (m) => m.role === 'reasoning'
      )
      const toolMessages = run?.reasoning_messages.filter(
        (message) => message.role === 'tool'
      )

      if (reasoningIndex !== -1 && toolMessages?.length > 0) {
        allTools = toolMessages as ToolCall[]
        processedMessages = [
          ...processedMessages.slice(0, reasoningIndex + 1),
          ...toolMessages,
          ...processedMessages.slice(reasoningIndex + 1)
        ]
      }
    }

    // Append metrics as a dedicated message so it renders as an accordion item
    if (run?.metrics && Object.keys(run.metrics).length > 0) {
      processedMessages = [
        ...processedMessages,
        {
          role: 'metrics',
          content: JSON.stringify(run.metrics),
          metrics: run.metrics,
          created_at: run.created_at
        }
      ]
    }

    return processedMessages
  }, [run.messages, run.reasoning_messages, run.metrics, run.created_at])

  return (
    <>
      {isShowingDetails ? (
        <DetailedRun
          messages={messages}
          run={run}
          index={index}
          isTeam={isTeam}
          isShowingDetails={isShowingDetails}
          metrics={run.metrics}
        />
      ) : (
        <RunMainInfo
          ref={mainInfoRef}
          run={run}
          index={index}
          isTeam={isTeam ?? false}
          allTools={allTools}
          viewMode={viewMode ?? FormatType.Formatted}
          isWorkflow={isWorkflow ?? false}
        />
      )}
    </>
  )
}

export default Run

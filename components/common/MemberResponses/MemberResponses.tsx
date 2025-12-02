import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { IntermediateStep, RunEvent, TeamRunEvent } from '@/types/playground'
import { RunResponseContent, ToolCall } from '@/types/Agent'

import { memo, useCallback, useState, useMemo, useRef, useEffect } from 'react'
import MemberResponsesList from './MemberResponsesList'
import { useSheet } from '@/providers/SheetProvider'
import {
  useAgentsPlaygroundStore,
  useTeamsPlaygroundStore
} from '@/stores/playground'
import { useFilterType } from '@/hooks/useFilterType'
import { motion } from 'framer-motion'

interface MemberResponsesProps {
  intermediateSteps?: IntermediateStep[]
  type?: 'accordion' | 'sheet'
}

type MemberResponsesSheetData = {
  agentResponses: IntermediateStep[]
  openAccordions: Record<string, boolean>
  handleMemberAccordionChange: (accordionId: string, value: string) => void
  getToolsForAgentResponse: (
    agentId: string,
    responseStep: IntermediateStep
  ) => Array<ToolCall & { isCompleted?: boolean }>
  messageIsStreaming: boolean
}

const MemberResponses = memo(
  ({ intermediateSteps = [], type = 'accordion' }: MemberResponsesProps) => {
    const [openAccordions, setOpenAccordions] = useState<
      Record<string, boolean>
    >({})

    const { isTeam } = useFilterType()
    const { isStreaming: isTeamStreaming } = useTeamsPlaygroundStore(
      (state) => state
    )
    const { isStreaming: isAgentStreaming } = useAgentsPlaygroundStore(
      (state) => state
    )
    const isStreaming = isTeam ? isTeamStreaming : isAgentStreaming
    const messageIsStreaming = isStreaming
    const { openSheet, isOpen, isCurrent, replaceSheetData } = useSheet()
    const sheetIdRef = useRef<string | null>(null)

    // Memoize the heavy calculation function to merge completed event data into content events
    const agentResponses = useMemo(() => {
      if (!intermediateSteps) return []

      const contentEvents = intermediateSteps.filter(
        (step) =>
          step.event === RunEvent.RunContent &&
          step.data.originalChunk?.agent_id &&
          (typeof step.data.originalChunk?.content === 'string' ||
            step.data.originalChunk?.response_audio?.transcript ||
            step.data.originalChunk?.images ||
            step.data.originalChunk?.videos ||
            step.data.originalChunk?.audio)
      )

      // Enhance each content event with data from its corresponding completed event
      return contentEvents.map((contentStep) => {
        const agentId = contentStep.data.originalChunk?.agent_id
        if (!agentId) return contentStep

        // Find the immediately next RunCompleted event for this agent after the content event
        const contentIndex = intermediateSteps.indexOf(contentStep)

        // Get the next event from the same agent
        const nextAgentEvent = intermediateSteps
          .slice(contentIndex + 1)
          .find((step) => step.data.originalChunk?.agent_id === agentId)

        // Check if it's a completed event with media
        const hasMedia =
          nextAgentEvent?.data.originalChunk?.images ||
          nextAgentEvent?.data.originalChunk?.videos ||
          nextAgentEvent?.data.originalChunk?.audio ||
          nextAgentEvent?.data.originalChunk?.response_audio
        const isValidCompleted =
          nextAgentEvent?.event === RunEvent.RunCompleted && hasMedia

        if (
          isValidCompleted &&
          nextAgentEvent?.data.originalChunk &&
          contentStep.data.originalChunk
        ) {
          const contentChunk = contentStep.data.originalChunk
          const completedChunk = nextAgentEvent.data.originalChunk

          const mergedChunk: RunResponseContent = {
            ...contentChunk,
            content_type: contentChunk.content_type || 'str',
            event: contentChunk.event,
            images: contentChunk.images || completedChunk.images,
            videos: contentChunk.videos || completedChunk.videos,
            audio: contentChunk.audio || completedChunk.audio,
            response_audio:
              contentChunk.response_audio || completedChunk.response_audio
          }

          return {
            ...contentStep,
            data: { ...contentStep.data, originalChunk: mergedChunk }
          }
        }

        return contentStep
      })
    }, [intermediateSteps])

    // Helper function to extract base ID from step ID (same as IntermediateSteps)
    const getBaseId = useCallback((stepId: string, eventType: string) => {
      const prefixes = eventType.includes('ToolCall')
        ? [
            `${RunEvent.ToolCallStarted}_`,
            `${RunEvent.ToolCallCompleted}_`,
            `${TeamRunEvent.TeamToolCallStarted}_`,
            `${TeamRunEvent.TeamToolCallCompleted}_`
          ]
        : []

      return prefixes.reduce((id, prefix) => id.replace(prefix, ''), stepId)
    }, [])

    // Helper function to get event type (simplified version for tools)
    const getEventType = useCallback((eventName: string): string => {
      if (eventName.includes('ToolCall')) return 'ToolCall'
      return 'Unknown'
    }, [])

    // Memoize the heavy calculation function to get tools for a specific agent response cycle
    const getToolsForAgentResponse = useCallback(
      (agentId: string, responseStep: IntermediateStep) => {
        if (!agentId) return []

        const responseIndex = intermediateSteps.indexOf(responseStep)

        // Find the previous RunStarted event for this agent before this response
        let startIndex = -1
        for (let i = responseIndex - 1; i >= 0; i--) {
          const step = intermediateSteps[i]
          if (
            step.data.originalChunk?.agent_id === agentId &&
            step.event === RunEvent.RunStarted
          ) {
            startIndex = i
            break
          }
        }

        // Find the next RunCompleted event for this agent after this response
        let endIndex = intermediateSteps.length
        for (let i = responseIndex + 1; i < intermediateSteps.length; i++) {
          const step = intermediateSteps[i]
          if (
            step.data.originalChunk?.agent_id === agentId &&
            step.event === RunEvent.RunCompleted
          ) {
            endIndex = i
            break
          }
        }

        // Get all tool call events between start and end for this agent
        const cycleSteps = intermediateSteps.slice(startIndex, endIndex + 1)
        const toolSteps = cycleSteps.filter(
          (step) =>
            step.data.originalChunk?.agent_id === agentId &&
            (step.event.includes(RunEvent.ToolCallStarted) ||
              step.event.includes(RunEvent.ToolCallCompleted))
        )

        // Process tool steps using the same deduplication logic as IntermediateSteps
        const processedToolSteps = toolSteps.reduce(
          (acc: IntermediateStep[], step) => {
            const eventType = getEventType(step.event)

            if (eventType.includes('ToolCall')) {
              const baseId = getBaseId(step.id, eventType)
              const existingIndex = acc.findIndex((existingStep) => {
                if (!existingStep.event.includes('ToolCall')) return false
                const existingBaseId = getBaseId(
                  existingStep.id,
                  getEventType(existingStep.event)
                )
                return existingBaseId === baseId
              })

              if (existingIndex >= 0) {
                // Replace with completed version if this is a completed event
                if (step.event.includes(RunEvent.ToolCallCompleted)) {
                  acc[existingIndex] = step
                }
              } else {
                // Add new tool call step
                acc.push(step)
              }
            }

            return acc
          },
          []
        )

        // Extract tool calls from the processed steps
        const toolCalls = processedToolSteps.flatMap((step) => {
          const originalChunk = step.data.originalChunk
          const tools = []

          if (originalChunk?.tool) {
            tools.push({
              ...originalChunk.tool,
              isCompleted: step.event.includes(RunEvent.ToolCallCompleted)
            })
          }

          if (originalChunk?.tools && originalChunk.tools.length > 0) {
            tools.push(
              ...originalChunk.tools.map((tool) => ({
                ...tool,
                isCompleted: step.event.includes(RunEvent.ToolCallCompleted)
              }))
            )
          }

          return tools
        })

        return toolCalls
      },
      [intermediateSteps, getBaseId, getEventType]
    )

    // Don't render if no agent responses
    if (agentResponses.length === 0) {
      return null
    }

    const handleAccordionChange = (value: string) => {
      const isOpening = value !== ''
      // if (isOpening) {
      //   stopScroll()
      // }
      setOpenAccordions((prev) => ({
        ...prev,
        'member-responses': isOpening
      }))
    }

    const handleMemberAccordionChange = (
      accordionId: string,
      value: string
    ) => {
      const isOpening = value !== ''
      // if (isOpening) {
      //   stopScroll()
      // }
      setOpenAccordions((prev) => ({
        ...prev,
        [accordionId]: isOpening
      }))
    }

    const handleSheetTrigger = () => {
      const id = openSheet?.(
        (data: MemberResponsesSheetData) => {
          const d = data
          return (
            <MemberResponsesList
              agentResponses={d?.agentResponses}
              openAccordions={d?.openAccordions}
              handleMemberAccordionChange={d?.handleMemberAccordionChange}
              getToolsForAgentResponse={d?.getToolsForAgentResponse}
              messageIsStreaming={d?.messageIsStreaming}
            />
          )
        },
        {
          side: 'right',
          title: 'Member Responses',
          initialData: {
            agentResponses: agentResponses.slice(),
            openAccordions: { ...openAccordions },
            messageIsStreaming,
            getToolsForAgentResponse,
            handleMemberAccordionChange
          }
        }
      )
      sheetIdRef.current = id
    }

    useEffect(() => {
      if (type !== 'sheet') return
      if (!sheetIdRef.current) return
      if (!isOpen) return
      if (!isCurrent(sheetIdRef.current)) return

      replaceSheetData<{
        agentResponses: IntermediateStep[]
        openAccordions: Record<string, boolean>
        messageIsStreaming: boolean
        getToolsForAgentResponse: typeof getToolsForAgentResponse
        handleMemberAccordionChange: typeof handleMemberAccordionChange
      }>({
        agentResponses: agentResponses.slice(),
        openAccordions: { ...openAccordions },
        messageIsStreaming,
        getToolsForAgentResponse,
        handleMemberAccordionChange
      })
    }, [
      type,
      isOpen,
      isCurrent,
      sheetIdRef.current,
      agentResponses,
      handleMemberAccordionChange,
      getToolsForAgentResponse,
      messageIsStreaming,
      replaceSheetData
    ])

    const MemberResponsesTriggerContent = ({
      type
    }: {
      type: 'accordion' | 'sheet'
    }) => (
      <div className="flex items-center gap-2 rounded-sm bg-secondary px-2 py-1">
        <Icon type="messages-square" size="xs" />
        <Paragraph size="label" className="uppercase text-primary">
          {agentResponses.length ? (
            <span className="text-muted"> {agentResponses.length} </span>
          ) : (
            ''
          )}{' '}
          Member Responses
        </Paragraph>
        <Icon
          type={type === 'sheet' ? 'caret-right' : 'caret-down'}
          size="xs"
          className={`transition-transform duration-200 ${
            type === 'sheet' ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </div>
    )

    return (
      <div className="flex flex-col gap-2">
        {type === 'sheet' ? (
          <motion.div
            className={`cursor-pointer py-1`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            tabIndex={0}
            // Sometimes onClick never fires during streaming because the node
            // is re-mounted between mouseDown and mouseUp (so the click is lost).
            // Using onPointerDown ensures the handler always runs early,

            onPointerDown={handleSheetTrigger}
          >
            <MemberResponsesTriggerContent type="sheet" />
          </motion.div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue={
              openAccordions['member-responses'] ? 'member-responses' : ''
            }
            className="w-full"
            onValueChange={handleAccordionChange}
          >
            <AccordionItem value="member-responses">
              <AccordionTrigger className="flex w-fit gap-2" showIcon={false}>
                <MemberResponsesTriggerContent type="accordion" />
              </AccordionTrigger>
              <AccordionContent className="flex w-full flex-col gap-4 pt-3">
                <MemberResponsesList
                  agentResponses={agentResponses}
                  openAccordions={openAccordions}
                  handleMemberAccordionChange={handleMemberAccordionChange}
                  getToolsForAgentResponse={getToolsForAgentResponse}
                  messageIsStreaming={messageIsStreaming}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    )
  }
)

MemberResponses.displayName = 'MemberResponses'

export default MemberResponses

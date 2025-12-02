import { ToolCallProps } from '@/types/playground'
import { useFilterType } from '@/hooks/useFilterType'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import { useAgentsPlaygroundStore } from '@/stores/playground'
import { useSheet } from '@/providers/SheetProvider'
import { useRef, useEffect, memo } from 'react'
import { SheetContent } from './SheetContent'
import { ToolCall } from '@/types/Agent'
import Icon from '@/components/ui/icon/Icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { motion } from 'framer-motion'
import DetailsDialog from '../InfoDetails/DetailsDialog'
import InfoDetailTool from '../InfoDetails/InfoDetailTool'

const animatedToolsMap = new Map<string, boolean>()

export const ToolComponent = memo(
  ({
    tool,
    tools,
    isCompleted = true,
    totalToolsCount,
    type = 'single'
  }: ToolCallProps) => {
    const { isTeam } = useFilterType()
    const { isStreaming: isTeamsStreaming } = useTeamsPlaygroundStore()
    const { isStreaming: isAgentsStreaming } = useAgentsPlaygroundStore()
    const { openSheet, replaceSheetData, isOpen, isCurrent } = useSheet()
    const sheetIdRef = useRef<string | null>(null)

    const isStreaming = isTeam ? isTeamsStreaming : isAgentsStreaming

    const toolKey = tools?.[0]?.tool_call_id
    const hasAnimated = useRef(
      toolKey ? (animatedToolsMap.get(toolKey) ?? false) : false
    )

    useEffect(() => {
      if (isStreaming && !hasAnimated.current && toolKey) {
        animatedToolsMap.set(toolKey, true)
        hasAnimated.current = true
      }
    }, [isStreaming, toolKey])

    const shouldAnimate = isStreaming && !hasAnimated.current

    const handleToolClick = () => {
      if (type === 'single') {
        return
      }
      if (!tools || tools.length === 0) return

      const id = openSheet(
        (data: { tools: ToolCall[] }) => <SheetContent tools={data.tools} />,
        {
          side: 'right',
          title: 'Tool Calls',
          initialData: { tools: tools.slice() }
        }
      )
      sheetIdRef.current = id
    }

    useEffect(() => {
      if (!tools) return
      if (!sheetIdRef.current) return
      if (!isOpen) return
      if (!isCurrent(sheetIdRef.current)) return

      replaceSheetData<{ tools: ToolCall[] }>({
        tools: tools.slice()
      })
    }, [tools, isOpen, isCurrent, replaceSheetData])

    return (
      <motion.div
        className={`cursor-pointer py-1 ${type === 'single' ? 'rounded-sm bg-secondary px-2 py-0.5 text-xs hover:bg-primary/10' : 'bg-transparent'}`}
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.3 }}
        onClick={handleToolClick}
      >
        {type === 'single' ? (
          <SingleToolComponent tool={tool} isCompleted={isCompleted} />
        ) : (
          <MultipleToolComponent totalToolsCount={totalToolsCount} />
        )}
      </motion.div>
    )
  }
)

const SingleToolComponent = ({ tool, isCompleted = true }: ToolCallProps) => {
  return (
    <DetailsDialog tools={tool} name={tool?.tool_name}>
      <div className="flex items-center justify-between gap-x-1">
        <p className="uppercase">{tool?.tool_name}</p>
        {isCompleted ? (
          <InfoDetailTool />
        ) : (
          <Icon
            type="loader-2"
            className="animate-spin text-muted/80"
            size="xs"
          />
        )}
      </div>
    </DetailsDialog>
  )
}

const MultipleToolComponent = ({ totalToolsCount }: ToolCallProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 rounded-sm bg-secondary px-2 py-1">
      <Icon type="hammer" size="xs" />
      <Paragraph size="label" className="space-x-2 uppercase">
        <span className="text-muted">{totalToolsCount} </span>
        {totalToolsCount && totalToolsCount > 1 ? 'Tools' : 'Tool'} Called
      </Paragraph>
      <Icon type="caret-right" size="xs" />
    </div>
  )
}

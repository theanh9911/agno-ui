import { Badge } from '@/components/ui/badge'
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ToolCall } from '@/types/workflow'
import React from 'react'
import InfoDetails from '@/components/common/Playground/InfoDetails/InfoDetails'
import { formatToolContent } from './utils'
import { useDialog } from '@/providers/DialogProvider'
// Filter out null values and format the content

const StepTools = ({ tool }: { tool: ToolCall }) => {
  const { openDialog } = useDialog()

  if (Object.keys(tool).length === 0) {
    return null
  }

  const formattedContent = formatToolContent(tool)

  const handleClick = () => {
    openDialog(
      <DialogContent className="max-w-2xl overflow-auto" showCloseButton>
        <DialogHeader>
          <DialogTitle className="uppercase">{tool.tool_name}</DialogTitle>
        </DialogHeader>

        {Object.entries(formattedContent).map(([key, value]) => (
          <InfoDetails
            key={key}
            title={key}
            icon="info"
            content={value}
            mode="display"
            codeCopyButton={false}
          />
        ))}
      </DialogContent>
    )
  }

  return (
    <Badge
      iconPosition="right"
      icon="info"
      variant="secondary"
      className="cursor-pointer uppercase"
      onClick={handleClick}
    >
      {tool.tool_name}
    </Badge>
  )
}

export default StepTools

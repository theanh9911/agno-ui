import React, { memo } from 'react'
import ToolsContent from './ToolsContent'
import { ToolCall } from '@/types/Agent'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Paragraph from '@/components/ui/typography/Paragraph'

interface SheetContentProps {
  tools: ToolCall[]
}

export const SheetContent = memo(({ tools }: SheetContentProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {tools.map((tool) => (
          <Accordion
            key={tool.tool_call_id}
            type="multiple"
            className="w-full rounded-lg border border-border p-4"
          >
            <AccordionItem value="tool-1">
              <AccordionTrigger
                className="justify-between text-sm font-medium uppercase"
                iconPosition="right"
                icon="chevron-down"
                iconSize="size-6"
                backgroundColor="bg-secondary"
                iconClassname="rounded-sm p-1"
              >
                <div className="flex flex-col gap-2">
                  <Paragraph size="title">{tool.tool_name}</Paragraph>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-4">
                <ToolsContent
                  key={tool.tool_call_id}
                  tools={tool}
                  role="tool"
                  hover={false}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  )
})

export default SheetContent

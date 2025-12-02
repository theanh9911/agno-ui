import Paragraph from '@/components/ui/typography/Paragraph'
import { ReasoningStepContent } from '@/types/playground'
import React from 'react'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'

interface ReasoningSheetContentProps {
  reasoning: ReasoningStepContent[]
}

export const ReasoningSheetContent = ({
  reasoning
}: ReasoningSheetContentProps) => {
  return (
    <div className="flex flex-col gap-3">
      {reasoning.map((step, index) =>
        step.title ? (
          <ReasoningStep
            index={index}
            key={`${step.title}-${index}`}
            title={step.title}
            result={step.result || step.reasoning}
          />
        ) : (
          <div
            className="flex flex-col gap-3 text-muted"
            key={`${step?.result || step?.reasoning}-${index}`}
          >
            <MarkdownRenderer>
              {step?.result || step?.reasoning}
            </MarkdownRenderer>
          </div>
        )
      )}
    </div>
  )
}

const ReasoningStep = ({
  index,
  title,
  result
}: {
  index: number
  title: string | undefined
  result: string | undefined | React.ReactNode
}) => {
  return (
    <div className="flex gap-2 text-muted">
      {title && <Paragraph size="body">{index + 1}.</Paragraph>}
      <div className="flex flex-col gap-1">
        {title && (
          <Paragraph size="label" className="uppercase">
            {title}
          </Paragraph>
        )}
        {result && <Paragraph size="xsmall">{result}</Paragraph>}
      </div>
    </div>
  )
}

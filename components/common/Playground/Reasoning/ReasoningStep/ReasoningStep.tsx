import React, { type FC } from 'react'

import Paragraph from '@/components/ui/typography/Paragraph'

interface ReasoningStepProps {
  index: number
  stepTitle: string
  stepContent?: React.ReactNode
}

const ReasoningStep: FC<ReasoningStepProps> = ({
  index,
  stepTitle,
  stepContent
}) => (
  <div className="flex flex-col gap-1 text-muted/80">
    {stepTitle && (
      <div className="flex gap-2">
        <Paragraph size="mono">{index + 1}.</Paragraph>

        <Paragraph size="xsmall" className="font-dmmono uppercase">
          {stepTitle}
        </Paragraph>
      </div>
    )}
    {stepContent && (
      <div className="flex gap-2">
        {!stepTitle && <Paragraph size="mono">{index + 1}.</Paragraph>}
        <Paragraph size="xsmall" className="ml-6 font-inter">
          {stepContent}
        </Paragraph>
      </div>
    )}
  </div>
)

export default ReasoningStep

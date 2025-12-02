import AccordianReasoning from './AccordianReasoning'
import SheetReasoning from './SheetReasoning'
import { ReasoningStepContent } from '@/types/playground'

interface ReasoningProps {
  type: 'accordion' | 'sheet'
  reasoning: ReasoningStepContent[]
  time?: string
  isLoading?: boolean
  label?: string
  open?: boolean
  defaultOpen?: boolean
  heightLimit?: number | null
}

const Reasoning = ({
  type,
  reasoning,
  time,
  isLoading,
  label,
  open,
  defaultOpen = false,
  heightLimit = null
}: ReasoningProps) => {
  return (
    <div>
      {type === 'accordion' ? (
        <AccordianReasoning
          reasoning={reasoning}
          time={time}
          isLoading={isLoading}
          label={label}
          defaultOpen={defaultOpen}
          heightLimit={heightLimit || undefined}
        />
      ) : (
        <SheetReasoning
          reasoning={reasoning}
          time={time}
          isLoading={isLoading}
          label={label}
          open={open}
        />
      )}
    </div>
  )
}

export default Reasoning

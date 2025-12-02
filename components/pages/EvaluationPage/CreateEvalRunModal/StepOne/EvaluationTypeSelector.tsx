import { Label } from '@/components/ui/label'
import { FormLabel } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { EvalRunType } from '@/types/evals'
import { cn } from '@/utils/cn'
import { PARAGRAPH_SIZES } from '@/components/ui/typography/Paragraph/constants'
import { EvalType } from '../type'
import { useFormContext } from 'react-hook-form'

interface EvaluationTypeSelectorProps {
  selectedType: EvalType | null
  onTypeChange: (value: EvalType) => void
  onSubmit: () => void
}

const EVALUATION_TYPES = [
  {
    id: 'accuracy',
    value: EvalRunType.Accuracy,
    label: 'Accuracy',
    description: 'Compare expected vs actual outputs'
  },
  {
    id: 'reliability',
    value: EvalRunType.Reliability,
    label: 'Reliability',
    description: 'Test tool call reliability and consistency'
  },
  {
    id: 'performance',
    value: EvalRunType.Performance,
    label: 'Performance',
    description: 'Measure response speed and efficiency'
  }
]
const EvaluationTypeSelector = ({
  selectedType,
  onTypeChange,
  onSubmit
}: EvaluationTypeSelectorProps) => {
  const form = useFormContext()
  const { isValid } = form.formState
  return (
    <div className="flex flex-col gap-y-2">
      <FormLabel>Choose Evaluation Type</FormLabel>
      <RadioGroup
        value={selectedType || ''}
        onValueChange={(value) => onTypeChange(value as EvalType)}
        className="space-y-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (isValid) onSubmit()
          }
        }}
      >
        {EVALUATION_TYPES.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <RadioGroupItem value={type.value} id={type.id} />
            <Label
              htmlFor={type.id}
              className={cn('text-primary', PARAGRAPH_SIZES.title)}
            >
              {type.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default EvaluationTypeSelector

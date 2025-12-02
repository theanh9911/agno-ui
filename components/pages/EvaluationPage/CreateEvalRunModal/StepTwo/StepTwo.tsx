import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@/components/ui/dialog'
import Paragraph from '@/components/ui/typography/Paragraph'
import FormFieldsRenderer from './FormFieldsRenderer'
import { EvalType } from '../type'
import { EvalRunType } from '@/types/evals'

interface StepTwoProps {
  selectedEvalType: EvalType
  handleBack: () => void
  currentStep: number
  onSubmit: () => void
}

const StepTwo = (props: StepTwoProps) => {
  const { selectedEvalType, handleBack, currentStep, onSubmit } = props

  let type = ''
  switch (selectedEvalType) {
    case EvalRunType.Accuracy:
      type = 'accurate'
      break
    case EvalRunType.Reliability:
      type = 'reliable'
      break
    case EvalRunType.Performance:
      type = 'performant'
      break
    default:
      type = ''
  }

  const descriptions = `Assess how ${type} an agent or team's response is`

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Run new evaluation</DialogTitle>
          <Paragraph className="text-muted" size="body">
            {currentStep} of 2
          </Paragraph>
        </div>
        <DialogDescription>{descriptions}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-y-4">
        <FormFieldsRenderer
          selectedEvalType={selectedEvalType}
          onSubmit={onSubmit}
        />
      </div>

      <DialogFooter className="flex flex-row gap-2">
        <Button
          variant="secondary"
          className="w-full text-xs uppercase"
          onClick={handleBack}
          type="button"
        >
          Back
        </Button>
        <Button
          variant="default"
          className="w-full text-xs uppercase"
          form="create-eval-run-form"
          type="submit"
        >
          Run Evaluation
        </Button>
      </DialogFooter>
    </>
  )
}

export default StepTwo

import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import { DialogDescription } from '@/components/ui/dialog'
import { DialogFooter, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import AgentTeamSelector from './AgentTeamSelector'
import EvaluationTypeSelector from './EvaluationTypeSelector'
import { EvalType } from '../type'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form'

interface StepOneProps {
  currentStep: number
  selectedEvalType: EvalType | null
  setSelectedEvalType: (value: EvalType) => void
  onSubmit: () => void
  handleCancel: () => void
  handleEntitySelection: (value: string) => void
  getSelectValue: () => string
}

const StepOne = (props: StepOneProps) => {
  const {
    currentStep,
    selectedEvalType,
    setSelectedEvalType,
    onSubmit,
    handleCancel,
    handleEntitySelection,
    getSelectValue
  } = props

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Run new evaluation</DialogTitle>
          <Paragraph className="text-muted" size="body">
            {currentStep} of 2
          </Paragraph>
        </div>
        <DialogDescription className="font-inter text-muted">
          Assess your agent or team's accuracy, reliability, or performance by
          running an evaluation.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-y-4">
        <FormField
          name="entitySelection"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AgentTeamSelector
                  onSelectionChange={(value) => {
                    field.onChange(value)
                    handleEntitySelection(value)
                  }}
                  selectedValue={getSelectValue()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="evalType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EvaluationTypeSelector
                  selectedType={selectedEvalType}
                  onTypeChange={(value) => {
                    field.onChange(value)
                    setSelectedEvalType(value)
                  }}
                  onSubmit={onSubmit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <DialogFooter className="flex flex-row gap-2">
        <Button
          variant="secondary"
          className="w-full text-xs uppercase"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          type="submit"
          className="w-full text-xs uppercase"
          form="create-eval-run-form"
        >
          Next
        </Button>
      </DialogFooter>
    </>
  )
}

export default StepOne

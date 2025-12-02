import { useState } from 'react'
import { useTheme } from 'next-themes'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Button } from '@/components/ui/button'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { BILLING_MESSAGES, PLAN_FEATURES } from '@/constants/billing'

interface Step {
  title: string
  description: string
  illustration: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
}

const STEPS: Step[] = [
  {
    title: BILLING_MESSAGES.WELCOME_TO_STARTER,
    description: PLAN_FEATURES.STARTER.DESCRIPTION,
    illustration: 'upgrade-success-step-1'
  },
  {
    title: 'Never hit limits again',
    description:
      'Run unlimited sessions with full data retention. No more interruptions or lost work due to session timeouts. Your code, outputs, and project history are preserved automatically, letting you focus on building instead of managing limits.',
    illustration: 'upgrade-success-step-2'
  },
  {
    title: 'Real-time Performance Insights',
    description:
      'Monitor live AgentOS metrics and system performance data. Track resource usage, identify bottlenecks, and optimize performance as you develop. Get the visibility you need to build efficient, scalable applications.',
    illustration: 'upgrade-success-step-3'
  },
  {
    title: 'Team collaboration',
    description:
      'Collaborate seamlessly with dedicated team seats and shared knowledge management. Your team can work together share insights and access priority support when needed. Scale your development efforts across your entire organization.',
    illustration: 'upgrade-success-step-4'
  }
]

export const BillingUpgradeSuccessContent = ({
  onClose,
  inline = false
}: {
  onClose: () => void
  inline?: boolean
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const { resolvedTheme } = useTheme()
  const currentStepData = STEPS[currentStep - 1]
  const totalSteps = STEPS.length

  const getIllustrationPath = (baseFilename: string) => {
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
    return `/images/billing/${baseFilename}-${theme}.svg`
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrimaryAction = () => {
    if (currentStepData.primaryAction) {
      currentStepData.primaryAction.onClick()
    } else {
      onClose()
    }
  }

  const body = (
    <div className="flex flex-row gap-2 overflow-hidden p-2">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <StepIndicator totalSteps={totalSteps} currentStep={currentStep} />

        <DialogTitle className="text-lg font-medium leading-[1.2] tracking-[-0.18px]">
          {currentStepData.title}
        </DialogTitle>

        <div className="flex-1 overflow-y-auto py-px">
          <Paragraph size="body" className="text-muted">
            {currentStepData.description}
          </Paragraph>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="h-8 px-4 py-2"
            >
              Back
            </Button>
            {currentStep < totalSteps && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                className="h-8 px-4 py-2"
              >
                Next
              </Button>
            )}
          </div>
          <Button
            size="sm"
            onClick={handlePrimaryAction}
            className="h-8 px-4 py-2"
          >
            {currentStepData.primaryAction?.label || 'Got It'}
          </Button>
        </div>
      </div>

      <div className="flex h-[305px] w-96 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        <img
          src={getIllustrationPath(currentStepData.illustration)}
          alt={`${currentStepData.title} illustration`}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  )

  if (inline) return body
  return (
    <DialogContent className="max-w-[800px] overflow-hidden p-0">
      {body}
    </DialogContent>
  )
}

interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
  className?: string
}

export const StepIndicator = ({
  totalSteps,
  currentStep,
  className = ''
}: StepIndicatorProps) => {
  return (
    <div
      className={`flex flex-row items-center justify-start gap-1 ${className}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep

        return (
          <div
            key={stepNumber}
            className={`h-1 rounded-lg transition-all duration-300 ease-in-out ${isActive ? 'w-6 bg-primary' : 'w-3 bg-primary/20'}`}
          />
        )
      })}
    </div>
  )
}

export default StepIndicator

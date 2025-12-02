import { IconType } from '@/components/ui/icon'
import { WorkflowStep, WorkflowStepExecutorType } from '@/types/workflow'
import { IconToStepTypeMap, StepType } from '@/utils/workflows'

export const getStepIcon = (stepType: StepType): IconType => {
  return IconToStepTypeMap[stepType]
}

export const getStepExecutorInfo = (
  step: WorkflowStep
): WorkflowStepExecutorType => {
  if (step?.agent) {
    return {
      type: 'agent',
      icon: 'agent',
      name: step.agent.name,
      id: step.agent.id
    }
  }

  if (step?.team) {
    return {
      type: 'team',
      icon: 'team',
      name: step.team.name,
      id: step.team.id,
      mode: step.team.mode
    }
  }

  return {
    type: 'function',
    icon: 'function-square'
  }
}

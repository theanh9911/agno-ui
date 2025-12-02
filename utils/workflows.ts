import { IconType } from '@/components/ui/icon'

export type StepType =
  | 'Steps'
  | 'Step'
  | 'Parallel'
  | 'Loop'
  | 'Condition'
  | 'Router'
  | 'Function'

export const IconToStepTypeMap: Record<StepType, IconType> = {
  Steps: 'columns',
  Step: 'arrow-right',
  Parallel: 'network',
  Loop: 'loop',
  Condition: 'split',
  Router: 'replace',
  Function: 'square-function'
}

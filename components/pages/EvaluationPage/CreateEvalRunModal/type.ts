import * as z from 'zod'
import { EvalRunType } from '@/types/evals'
import { FilterType } from '@/types/filter'
import {
  baseFormSchema,
  accuracyFormSchema,
  reliabilityFormSchema,
  performanceFormSchema
} from './forms'

export type EvalType = EvalRunType
export type EntityType = FilterType.Agents | FilterType.Teams

export enum FormFieldName {
  RUN_NAME = 'runName',
  EVALUATION_MODEL = 'evaluationModel',
  INPUT = 'input',
  WARMUP_RUNS = 'warmupRuns',
  ITERATIONS = 'iterations',
  EXPECTED_TOOL_CALLS = 'expectedToolCalls',
  GUIDELINES = 'guidelines',
  EXPECTED_OUTPUT = 'expectedOutput'
}

export type BaseFormData = z.infer<typeof baseFormSchema>
export type AccuracyFormData = z.infer<typeof accuracyFormSchema>
export type ReliabilityFormData = z.infer<typeof reliabilityFormSchema>
export type PerformanceFormData = z.infer<typeof performanceFormSchema>

export type StepOneFormData = {
  entitySelection: string
  evalType: string
}

export type FormData = StepOneFormData &
  (BaseFormData | AccuracyFormData | ReliabilityFormData | PerformanceFormData)

export interface FormFieldConfig {
  name: FormFieldName
  label: string
  type: 'input' | 'textarea' | 'select' | 'tag-input'
  optional?: boolean
  inputType?: string
  placeholder?: string
  className?: string
  min?: string
}

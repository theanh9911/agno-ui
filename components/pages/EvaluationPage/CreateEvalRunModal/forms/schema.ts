import { z } from 'zod'

import { EvalRunType } from '@/types/evals'

// Schema for step one of the evaluation form
export const createStepOneSchema = (isAgentTeamPresent: boolean) =>
  z.object({
    entitySelection: z
      .string()
      .min(
        1,
        isAgentTeamPresent
          ? 'Please select an agent or team'
          : 'No agent or team available'
      ),
    evalType: z.string().min(1, 'Please select an evaluation type')
  })

// Base schema for step two
export const baseFormSchema = z.object({
  runName: z.string().min(1, 'Run name is required'),
  input: z.string().min(1, 'Input is required'),
  guidelines: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ''),
  evaluationModel: z.string().min(1, 'Evaluation model is required')
})

export const accuracyFormSchema = baseFormSchema.extend({
  expectedOutput: z.string().min(1, 'Expected output is required'),
  iterations: z.coerce.number().min(1, 'Must be at least 1').default(1)
})

export const reliabilityFormSchema = baseFormSchema.extend({
  expectedToolCalls: z
    .array(z.string())
    .min(1, 'Expected tool calls are required')
    .default([]),
  iterations: z.coerce.number().min(1, 'Must be at least 1').default(1)
})

export const performanceFormSchema = baseFormSchema.extend({
  warmupRuns: z.coerce.number().min(0, 'Must be at least 0').default(0),
  iterations: z.coerce.number().min(1, 'Must be at least 1').default(1)
})

export const evalRunSchemaMap = {
  [EvalRunType.Accuracy]: accuracyFormSchema,
  [EvalRunType.Reliability]: reliabilityFormSchema,
  [EvalRunType.Performance]: performanceFormSchema
} as const

import { EvalRunData, EvalRunType } from '@/types/evals'
import {
  EvalType,
  FormFieldConfig,
  FormFieldName,
  FormData
} from './CreateEvalRunModal/type'
import { OSModel, OSConfig } from '@/types/os'
import { FilterType } from '@/types/filter'
import { EntityType } from './CreateEvalRunModal/type'
import {
  EVAL_FORM_COMMON_FIELDS,
  EVAL_FORM_ITERATIONS_FIELD,
  EVAL_FORM_GUIDELINES_FIELD,
  EVAL_FORM_WARMUP_RUNS_FIELD,
  EVAL_FORM_EXPECTED_TOOL_CALLS_FIELD,
  EVAL_FORM_EXPECTED_OUTPUT_FIELD
} from './constant'

// Helper function to format keys for display
export const formatHeaderKey = (key: string) => {
  if (key === 'std_dev_score') return 'Std deviation'
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

export const getFormFields = (
  selectedEvalType: EvalType | null
): FormFieldConfig[] => {
  if (selectedEvalType === EvalRunType.Performance) {
    return [
      ...EVAL_FORM_COMMON_FIELDS,
      EVAL_FORM_WARMUP_RUNS_FIELD,
      EVAL_FORM_ITERATIONS_FIELD
    ]
  }

  if (selectedEvalType === EvalRunType.Reliability) {
    return [
      ...EVAL_FORM_COMMON_FIELDS,
      EVAL_FORM_ITERATIONS_FIELD,
      EVAL_FORM_EXPECTED_TOOL_CALLS_FIELD,
      EVAL_FORM_GUIDELINES_FIELD
    ]
  }

  return [
    ...EVAL_FORM_COMMON_FIELDS,
    EVAL_FORM_ITERATIONS_FIELD,
    EVAL_FORM_EXPECTED_OUTPUT_FIELD,
    EVAL_FORM_GUIDELINES_FIELD
  ]
}

// Default values for the form when no prefilled data is available
export const getDefaultValues = (
  evalType: EvalType | null,
  osModels?: OSModel[]
): FormData => {
  const firstModelValue =
    osModels && osModels.length > 0
      ? `${osModels[0].id}|${osModels[0].provider}`
      : ''

  const base = {
    [FormFieldName.RUN_NAME]: '',
    [FormFieldName.INPUT]: '',
    [FormFieldName.GUIDELINES]: '',
    [FormFieldName.EVALUATION_MODEL]: firstModelValue,
    entitySelection: '',
    evalType: evalType || ''
  }

  if (evalType === EvalRunType.Performance) {
    return {
      ...base,
      [FormFieldName.WARMUP_RUNS]: 0,
      [FormFieldName.ITERATIONS]: 1
    }
  }

  if (evalType === EvalRunType.Reliability) {
    return {
      ...base,
      [FormFieldName.ITERATIONS]: 1,
      [FormFieldName.EXPECTED_TOOL_CALLS]: []
    }
  }

  if (evalType === EvalRunType.Accuracy) {
    return {
      ...base,
      [FormFieldName.ITERATIONS]: 1,
      [FormFieldName.EXPECTED_OUTPUT]: ''
    }
  }

  return base
}

/**
 * Helper function to validate if entity exists in available options
 */
export const validateEntityExists = (
  osConfig: OSConfig,
  entityType: EntityType,
  entityId: string
): boolean => {
  if (!osConfig) return false

  if (entityType === FilterType.Agents) {
    return osConfig.agents?.some((agent) => agent.id === entityId) ?? false
  }
  if (entityType === FilterType.Teams) {
    return osConfig.teams?.some((team) => team.id === entityId) ?? false
  }

  return false
}

/**
 * Gets computed default values, preferring prefilled data when available
 */
export const getComputedDefaultValues = (
  preFilledEvalRunData: EvalRunData | null,
  selectedEvalType: EvalType | null,
  osModels?: OSModel[]
): FormData => {
  // Return prefilled data else return default values
  if (preFilledEvalRunData && selectedEvalType && osModels) {
    const modelValue = preFilledEvalRunData.model_provider
      ? `${preFilledEvalRunData.model_id}|${preFilledEvalRunData.model_provider}`
      : preFilledEvalRunData.model_id

    const {
      additional_guidelines: extractedGuidelines = '',
      input: extractedInput = '',
      expected_output: extractedExpectedOutput = '',
      expected_tool_calls: extractedExpectedToolCalls = [],
      num_iterations: extractedNumIterations = 1,
      warmup_runs: extractedWarmupRuns = 0
    } = preFilledEvalRunData.eval_input || {}

    const baseData = {
      [FormFieldName.RUN_NAME]: preFilledEvalRunData.name || '',
      [FormFieldName.EVALUATION_MODEL]: modelValue,
      [FormFieldName.INPUT]: extractedInput,
      [FormFieldName.GUIDELINES]: extractedGuidelines,
      entitySelection:
        preFilledEvalRunData.agent_id || preFilledEvalRunData.team_id || '',
      evalType: preFilledEvalRunData.eval_type || selectedEvalType || ''
    }

    if (preFilledEvalRunData.eval_type === EvalRunType.Accuracy) {
      return {
        ...baseData,
        [FormFieldName.ITERATIONS]: extractedNumIterations,
        [FormFieldName.EXPECTED_OUTPUT]: extractedExpectedOutput,
        entitySelection: baseData.entitySelection,
        evalType: baseData.evalType
      } as FormData
    }

    if (preFilledEvalRunData.eval_type === EvalRunType.Reliability) {
      return {
        ...baseData,
        [FormFieldName.ITERATIONS]: extractedNumIterations,
        [FormFieldName.EXPECTED_TOOL_CALLS]: extractedExpectedToolCalls,
        entitySelection: baseData.entitySelection,
        evalType: baseData.evalType
      } as FormData
    }

    if (preFilledEvalRunData.eval_type === EvalRunType.Performance) {
      return {
        ...baseData,
        [FormFieldName.ITERATIONS]: extractedNumIterations,
        [FormFieldName.WARMUP_RUNS]: extractedWarmupRuns,
        entitySelection: baseData.entitySelection,
        evalType: baseData.evalType
      } as FormData
    }

    return {
      ...baseData,
      entitySelection: baseData.entitySelection,
      evalType: baseData.evalType
    } as FormData
  }
  return getDefaultValues(selectedEvalType, osModels)
}

/**
 * Extracts entity information from prefilled evaluation data with validation
 */
export const getValidatedEntityData = (
  preFilledEvalRunData: EvalRunData | null,
  osConfig: OSConfig
) => {
  if (!preFilledEvalRunData || !osConfig) return null

  const entityType: EntityType = preFilledEvalRunData.agent_id
    ? FilterType.Agents
    : FilterType.Teams
  const entityId = preFilledEvalRunData.agent_id || preFilledEvalRunData.team_id

  if (!entityId) return null

  // Only return entity data if the entity exists in available options
  const entityExists = validateEntityExists(osConfig, entityType, entityId)

  return {
    entityType: entityExists ? entityType : null,
    entityId: entityExists ? entityId : null,
    evalType: preFilledEvalRunData.eval_type,
    entityExists
  }
}

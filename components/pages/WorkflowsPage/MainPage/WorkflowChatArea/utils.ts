import { IconType } from '@/components/ui/icon'
import type { StepExecutorRun, StepResult, ToolCall } from '@/types/workflow'
import { getStepIcon } from '../../utils'
import { Metrics } from '@/types/Agent'

const OMITTED_FIELDS = ['tool_call_id']

const formatObjectToBulletPoints = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .filter(([, val]) => val !== null && val !== undefined && val !== '')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n')
}

const formatValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return JSON.stringify(value, null, 2)
    }
    return ''
  }

  if (typeof value === 'object' && value !== null) {
    return formatObjectToBulletPoints(value as Record<string, unknown>) || ''
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return formatObjectToBulletPoints(parsed) || ''
      }
      return value
    } catch {
      return value
    }
  }

  return String(value)
}

export const formatToolContent = (
  toolData: ToolCall
): Record<string, string> => {
  const formattedContent: Record<string, string> = {}

  Object.entries(toolData).forEach(([key, value]) => {
    if (OMITTED_FIELDS.includes(key)) {
      return
    }

    if (value !== null && value !== undefined) {
      formattedContent[key] = formatValue(value)
    }
  })

  return formattedContent
}

export type StepAccordionItemProps = {
  step: StepResult | StepExecutorRun
  stepIndex: number
  step_executor_runs: StepExecutorRun[]
  depth?: number
  parentStepNumber?: string
  metrics?: Metrics
  showMetrics?: boolean
  isExecutorRun?: boolean
  messageStatus?: string
}

export interface StepDetails {
  displayName: string
  displayIcon: IconType | null
  accordionValue: string
  stepTypeIcon: IconType | null
  stepTypeLabel: string | null
}

// Helper function to generate hierarchical step numbers
export const generateStepNumber = (
  depth: number,
  stepIndex: number,
  parentStepNumber?: string
): string => {
  if (depth === 0) {
    return `${stepIndex + 1}`
  }

  if (parentStepNumber) {
    return `${parentStepNumber}.${stepIndex + 1}`
  }

  return `${stepIndex + 1}`
}

// Type guard to check if this is an executor run
export const isExecutorRun = (stepIndex: number): boolean => stepIndex === -1

// Helper function to get executor run details
export const getExecutorRunDetails = (step: StepExecutorRun): StepDetails => {
  const isTeam = step?.team_name
  const isAgent = step?.agent_name

  if (isTeam) {
    return {
      displayName: step.team_name ?? '',
      displayIcon: 'team',
      accordionValue: `executor-${step.run_id || 'unknown'}`,
      stepTypeIcon: null,
      stepTypeLabel: null
    }
  }

  if (isAgent) {
    return {
      displayName: step.agent_name ?? '',
      displayIcon: 'agent',
      accordionValue: `executor-${step.run_id || 'unknown'}`,
      stepTypeIcon: null,
      stepTypeLabel: null
    }
  }

  // Default case for executor runs
  return {
    displayName: '',
    displayIcon: null,
    accordionValue: `executor-unknown`,
    stepTypeIcon: null,
    stepTypeLabel: null
  }
}

// Helper function to get workflow step details
export const getWorkflowStepDetails = (
  step: StepResult,
  stepIndex: number
): StepDetails => {
  const accordionValue = step.step_run_id
    ? `step-${step.step_run_id}`
    : `step-${stepIndex}`

  const stepType = step.step_type || null

  return {
    displayName: step.step_name || '',
    displayIcon: null,
    accordionValue,
    stepTypeIcon: stepType ? getStepIcon(stepType) : null,
    stepTypeLabel: stepType
  }
}

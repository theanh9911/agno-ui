import { useCallback, useState, useMemo, useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogContent } from '@/components/ui/dialog'
import { useCreateEvalRunsQuery } from '@/hooks/evals/useCreateEvalRunsQuery'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import { useDialog } from '@/providers/DialogProvider'
import { EvalRunData, EvalRunType } from '@/types/evals'
import { FilterType } from '@/types/filter'
import { evalRunSchemaMap, baseFormSchema, createStepOneSchema } from './forms'
import {
  EvalType,
  EntityType,
  FormData,
  AccuracyFormData,
  ReliabilityFormData,
  PerformanceFormData
} from './type'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { Form } from '@/components/ui/form'
import { getComputedDefaultValues, getValidatedEntityData } from '../util'
import { useOSModelsQuery } from '@/api/hooks/queries/os/useOSModelsQuery'
import { useFetchOSConfig } from '@/hooks/os/useFetchOSConfig'

interface CreateEvalRunModalProps {
  preFilledData?: EvalRunData
}

interface ModalState {
  selectedEntityType: EntityType | null
  selectedEntityId: string | null
  selectedEvalType: EvalType | null
  currentStep: number
}

const initialState: ModalState = {
  selectedEntityType: null,
  selectedEntityId: null,
  selectedEvalType: null,
  currentStep: 1
}

const CreateEvalRunModal: FC<CreateEvalRunModalProps> = ({ preFilledData }) => {
  const { closeDialog } = useDialog()
  const createEvalRunMutation = useCreateEvalRunsQuery()
  const { pendingEvaluations, setPendingEvaluations } = useEvaluationStore()
  const { data: osModels } = useOSModelsQuery()
  const { data: osConfig } = useFetchOSConfig()

  const [state, setState] = useState<ModalState>(initialState)
  const {
    selectedEntityType,
    selectedEntityId,
    selectedEvalType,
    currentStep
  } = state

  const getSelectValue = useCallback(() => {
    if (!selectedEntityType || !selectedEntityId) return ''
    const entityTypeKey =
      selectedEntityType === FilterType.Agents ? 'agent' : 'team'
    return `${entityTypeKey}:${selectedEntityId}`
  }, [selectedEntityType, selectedEntityId])

  const schema = useMemo(() => {
    if (currentStep === 1) {
      const isAgentTeamPresent = Boolean(
        (osConfig?.agents?.length ?? 0) > 0 ||
          (osConfig?.teams?.length ?? 0) > 0
      )
      return createStepOneSchema(isAgentTeamPresent)
    }
    if (selectedEvalType) {
      return evalRunSchemaMap[selectedEvalType]
    }
    return baseFormSchema
  }, [selectedEvalType, currentStep, osConfig])

  // Get computed default values using utility function
  const defaultValues = useMemo(() => {
    if (currentStep === 1) {
      return {
        entitySelection: getSelectValue(),
        evalType: selectedEvalType || ''
      }
    }
    return getComputedDefaultValues(
      preFilledData || null,
      selectedEvalType,
      osModels
    )
  }, [currentStep, preFilledData, selectedEvalType, osModels, getSelectValue])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  })

  // Reset form when step or schema changes
  useEffect(() => {
    const values =
      currentStep === 1
        ? {
            entitySelection: getSelectValue(),
            evalType: selectedEvalType || ''
          }
        : getComputedDefaultValues(
            preFilledData || null,
            selectedEvalType,
            osModels
          )

    // Only trigger validation if we have prefilled data in step 2
    const shouldTriggerValidation = currentStep === 2 && preFilledData

    form.reset(values)

    if (shouldTriggerValidation) {
      form.trigger()
    }
  }, [currentStep, selectedEvalType, osModels, preFilledData])

  // Set the entity type and ID from prefilled data (only if entity exists)
  useEffect(() => {
    if (preFilledData && osConfig) {
      const validatedEntityData = getValidatedEntityData(
        preFilledData,
        osConfig
      )

      if (validatedEntityData) {
        setState((prev) => ({
          ...prev,
          selectedEntityType: validatedEntityData.entityType,
          selectedEntityId: validatedEntityData.entityId,
          selectedEvalType: validatedEntityData.evalType
        }))
      }
    }
  }, [preFilledData, osConfig])

  const handleEntitySelection = useCallback((value: string) => {
    const [type, id] = value.includes(':') ? value.split(':') : ['', '']
    setState((prev) => ({
      ...prev,
      selectedEntityType:
        type === 'agent' ? FilterType.Agents : FilterType.Teams,
      selectedEntityId: id
    }))
  }, [])

  const isStep1Valid = selectedEntityId && selectedEvalType

  const handleNext = useCallback(() => {
    if (currentStep === 1 && isStep1Valid) {
      setState((prev) => ({ ...prev, currentStep: 2 }))
    }
  }, [currentStep, isStep1Valid])

  const handleBack = useCallback(() => {
    if (currentStep === 2) {
      setState((prev) => ({ ...prev, currentStep: 1 }))
    }
  }, [currentStep])

  const resetModal = useCallback(() => {
    closeDialog()
    setState(initialState)
    form.reset()
  }, [closeDialog, form])

  const createPayload = useCallback(
    (data: FormData, id: string, modelId: string, modelProvider: string) => {
      const basePayload = {
        id,
        agent_id:
          selectedEntityType === FilterType.Agents ? selectedEntityId! : '',
        team_id:
          selectedEntityType === FilterType.Teams ? selectedEntityId! : '',
        input: data.input,
        name: data.runName,
        eval_type: selectedEvalType!,
        model_id: modelId,
        model_provider: modelProvider,
        expected_output: '',
        num_iterations: 1,
        warmup_runs: 0,
        expected_tool_calls: [] as string[]
      }

      const typeSpecificUpdates: Record<
        EvalRunType,
        (data: FormData) => Partial<typeof basePayload>
      > = {
        [EvalRunType.Accuracy]: (data) => ({
          expected_output: (data as AccuracyFormData).expectedOutput || '',
          num_iterations: (data as AccuracyFormData).iterations || 1
        }),
        [EvalRunType.Reliability]: (data) => ({
          num_iterations: (data as ReliabilityFormData).iterations || 1,
          expected_tool_calls:
            (data as ReliabilityFormData).expectedToolCalls || []
        }),
        [EvalRunType.Performance]: (data) => ({
          num_iterations: (data as PerformanceFormData).iterations || 1,
          warmup_runs: (data as PerformanceFormData).warmupRuns || 0
        })
      }

      return {
        ...basePayload,
        ...typeSpecificUpdates[selectedEvalType!](data)
      }
    },
    [selectedEntityType, selectedEntityId, selectedEvalType]
  )

  const handleCreateEvalRun = useCallback(
    async (data: FormData) => {
      if (!selectedEntityId || !selectedEvalType) return

      const id = crypto.randomUUID()
      const [modelId, modelProvider] = data.evaluationModel?.split('|') || [
        '',
        ''
      ]

      const payload = createPayload(data, id, modelId, modelProvider)

      resetModal()
      createEvalRunMutation.mutate(payload)

      setPendingEvaluations([
        ...pendingEvaluations,
        {
          id,
          eval_name: data.runName,
          entity_id: selectedEntityId,
          updated_at: new Date().toISOString(),
          model: modelId,
          type: selectedEvalType,
          agent_id:
            selectedEntityType === FilterType.Agents
              ? selectedEntityId
              : undefined,
          team_id:
            selectedEntityType === FilterType.Teams
              ? selectedEntityId
              : undefined
        }
      ])
    },
    [
      selectedEntityId,
      selectedEvalType,
      createPayload,
      resetModal,
      createEvalRunMutation,
      pendingEvaluations,
      setPendingEvaluations
    ]
  )

  const onSubmit = form.handleSubmit((data) => {
    if (currentStep === 1) {
      handleNext()
    } else {
      handleCreateEvalRun(data)
    }
  })

  const setSelectedEvalType = useCallback((evalType: EvalType) => {
    setState((prev) => ({ ...prev, selectedEvalType: evalType }))
  }, [])

  return (
    <DialogContent className="max-h-[90rem] min-w-[35rem] overflow-visible">
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={onSubmit}
          id="create-eval-run-form"
        >
          {currentStep === 1 ? (
            <StepOne
              currentStep={currentStep}
              selectedEvalType={selectedEvalType}
              setSelectedEvalType={setSelectedEvalType}
              onSubmit={onSubmit}
              handleCancel={resetModal}
              handleEntitySelection={handleEntitySelection}
              getSelectValue={getSelectValue}
            />
          ) : selectedEvalType ? (
            <StepTwo
              selectedEvalType={selectedEvalType}
              handleBack={handleBack}
              currentStep={currentStep}
              onSubmit={onSubmit}
            />
          ) : null}
        </form>
      </Form>
    </DialogContent>
  )
}

export default CreateEvalRunModal

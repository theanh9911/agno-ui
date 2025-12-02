import { useMemo } from 'react'
import { useOSModelsQuery } from '@/api/hooks/queries/os/useOSModelsQuery'
import { EvalRunType } from '@/types/evals'
import { EvalType, FormFieldName } from '../type'
import { getFormFields } from '../../util'
import CustomFormField from './CustomFormField'

interface FormFieldsRendererProps {
  selectedEvalType: EvalType
  onSubmit: () => void
}

interface FieldGroup {
  fields: FormFieldName[]
  layout: 'row' | 'individual'
}

interface LayoutConfig {
  groups: FieldGroup[]
}

const FormFieldsRenderer = ({
  selectedEvalType,
  onSubmit
}: FormFieldsRendererProps) => {
  const formFields = useMemo(
    () => getFormFields(selectedEvalType),
    [selectedEvalType]
  )
  const { data: osModels } = useOSModelsQuery()

  // Configuration for different eval types
  const layoutConfigs: Record<EvalRunType, LayoutConfig> = {
    [EvalRunType.Performance]: {
      groups: [
        {
          fields: [FormFieldName.RUN_NAME, FormFieldName.EVALUATION_MODEL],
          layout: 'row'
        },
        {
          fields: [FormFieldName.WARMUP_RUNS, FormFieldName.ITERATIONS],
          layout: 'row'
        },
        { fields: [FormFieldName.INPUT], layout: 'individual' }
      ]
    },
    [EvalRunType.Reliability]: {
      groups: [
        {
          fields: [
            FormFieldName.RUN_NAME,
            FormFieldName.ITERATIONS,
            FormFieldName.EVALUATION_MODEL
          ],
          layout: 'row'
        },
        {
          fields: [
            FormFieldName.INPUT,
            FormFieldName.EXPECTED_TOOL_CALLS,
            FormFieldName.GUIDELINES
          ],
          layout: 'individual'
        }
      ]
    },
    [EvalRunType.Accuracy]: {
      groups: [
        {
          fields: [
            FormFieldName.RUN_NAME,
            FormFieldName.ITERATIONS,
            FormFieldName.EVALUATION_MODEL
          ],
          layout: 'row'
        },
        {
          fields: [
            FormFieldName.INPUT,
            FormFieldName.EXPECTED_OUTPUT,
            FormFieldName.GUIDELINES
          ],
          layout: 'individual'
        }
      ]
    }
  }

  const renderFieldGroup = (group: FieldGroup) => {
    const groupFields = formFields.filter((field) =>
      group.fields.includes(field.name)
    )

    if (group.layout === 'row') {
      return (
        <div className="flex flex-row gap-x-4">
          {groupFields.map((field) => (
            <CustomFormField
              key={field.name}
              config={field}
              modelOptions={osModels || []}
              onSubmit={onSubmit}
            />
          ))}
        </div>
      )
    }

    // Individual layout
    return (
      <>
        {groupFields.map((field) => (
          <CustomFormField
            key={field.name}
            config={field}
            modelOptions={osModels || []}
            onSubmit={onSubmit}
          />
        ))}
      </>
    )
  }

  const config =
    layoutConfigs[selectedEvalType] || layoutConfigs[EvalRunType.Accuracy]

  return (
    <>
      {config.groups.map((group, index) => (
        <div key={index} className="flex flex-col gap-y-4">
          {renderFieldGroup(group)}
        </div>
      ))}
    </>
  )
}

export default FormFieldsRenderer

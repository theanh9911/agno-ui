import { Control, FieldPath, FieldValues } from 'react-hook-form'

import { FormField } from '@/components/ui/form'
import TextInputField from './TextInputField'
import BooleanField from './BooleanField'
import TagInput from '@/components/common/TagControls/TagInput'
import JSONTextarea from './JSONTextarea'

import { type WorkflowStepInputSchema } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import Paragraph from '@/components/ui/typography/Paragraph'
import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'
import Types from './Types'

interface WorkflowFormFieldsProps<T extends FieldValues> {
  workflowSchema: WorkflowStepInputSchema | null | undefined
  control: Control<T>
}

/**
 * Component for rendering dynamic form fields based on workflow schema
 * Supports string, number, and integer field types with validation
 */
const WorkflowFormFields = <T extends FieldValues>({
  workflowSchema,
  control
}: WorkflowFormFieldsProps<T>) => {
  // If no schema is defined, render a fallback message input field
  if (!workflowSchema?.properties) {
    return (
      <FormField
        control={control}
        name={'message' as FieldPath<T>}
        render={({ field: formField, fieldState }) => (
          <div>
            <TextInputField
              label="Ask anything"
              required={true}
              defaultValue={formField.value || ''}
              placeholder="Please enter a message"
              onChange={(value) => {
                formField.onChange(value)
              }}
            />
            {fieldState.error && (
              <Paragraph size="xs" className="text-red-500">
                {fieldState.error.message}
              </Paragraph>
            )}
          </div>
        )}
      />
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderField = ([fieldName, field]: [string, any]) => {
    const isRequired = workflowSchema?.required?.includes(fieldName) || false

    return (
      <FormField
        key={fieldName}
        control={control}
        name={fieldName as FieldPath<T>}
        render={({ field: formField, fieldState }) => (
          <div>
            {(() => {
              // Handle anyOf schemas with multiple types using Types component
              if (field.anyOf && field.anyOf.length > 0) {
                return (
                  <Types
                    fieldName={fieldName}
                    field={field}
                    isRequired={isRequired}
                    value={formField.value}
                    onChange={formField.onChange}
                    error={fieldState.error?.message}
                  />
                )
              }

              switch (field.type) {
                case 'string':
                  return (
                    <TextInputField
                      label={field.title || fieldName}
                      description={field.description}
                      required={isRequired}
                      defaultValue={formField.value || ''}
                      placeholder={`Enter ${field.title || fieldName}`}
                      onChange={(value) => {
                        formField.onChange(value)
                      }}
                    />
                  )
                case 'number':
                case 'integer':
                  return (
                    <div className="flex w-full flex-col gap-y-2">
                      <div className="flex items-center gap-x-1">
                        <span className="font-dmmono text-xs font-normal uppercase">
                          {field.title || fieldName}
                        </span>
                        {isRequired && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                        {field.description && (
                          <Tooltip
                            content={field.description}
                            delayDuration={0}
                            side="top"
                            contentClassName="max-w-xs"
                          >
                            <Icon type="info" size="xs" />
                          </Tooltip>
                        )}
                      </div>
                      <Input
                        type="number"
                        required={isRequired}
                        defaultValue={formField.value || ''}
                        placeholder={`Enter ${field.title || fieldName}`}
                        onChange={(e) => {
                          formField.onChange(Number(e.target.value))
                        }}
                        className="rounded-lg border-none bg-secondary"
                      />
                    </div>
                  )

                case 'boolean':
                  return (
                    <BooleanField
                      label={field.title || fieldName}
                      description={field.description}
                      required={isRequired}
                      value={formField.value || false}
                      onChange={(value) => {
                        formField.onChange(value)
                      }}
                    />
                  )

                case 'array':
                  return (
                    <div className="flex w-full flex-col justify-start gap-y-2">
                      <div className="flex items-center gap-x-1">
                        <span className="font-dmmono text-xs font-normal uppercase">
                          {field.title || fieldName}
                        </span>
                        {isRequired && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                        {field.description && (
                          <Tooltip
                            content={field.description}
                            delayDuration={0}
                            side="top"
                            contentClassName="max-w-xs"
                          >
                            <Icon type="info" size="xs" />
                          </Tooltip>
                        )}
                      </div>
                      <TagInput
                        tags={formField.value || []}
                        onTagsChange={(tags) => {
                          formField.onChange(tags)
                        }}
                        placeholder={`Add ${field.title || fieldName}...`}
                        inputClassName="bg-secondary border-none rounded-lg"
                        onEmptyEnter={(e) => {
                          document.dispatchEvent(
                            new CustomEvent('workflow-next-field', {
                              detail: { currentElement: e.target }
                            })
                          )
                        }}
                      />
                    </div>
                  )

                case 'object':
                default:
                  // For objects and any other complex types, use JSON textarea
                  return (
                    <JSONTextarea
                      label={field.title || fieldName}
                      description={field.description}
                      required={isRequired}
                      value={formField.value || '{}'}
                      onChange={(value) => {
                        formField.onChange(value)
                      }}
                    />
                  )
              }
            })()}
            {fieldState.error && (
              <Paragraph size="xs" className="text-red-500">
                {fieldState.error.message}
              </Paragraph>
            )}
          </div>
        )}
      />
    )
  }

  return <>{Object.entries(workflowSchema.properties).map(renderField)}</>
}

export default WorkflowFormFields

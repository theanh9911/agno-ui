import { type FC, memo, useMemo, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Icon from '@/components/ui/icon'
import Tooltip from '@/components/common/Tooltip'
import { getProviderIcon } from '@/utils/modelProvider'
import { cn } from '@/utils/cn'
import type { FormFieldConfig, FormData } from '../type'
import Paragraph from '@/components/ui/typography/Paragraph'
import { TOOLTIP_CONTENT } from '../../constant'
import { TagInput } from '@/components/common/TagControls'

interface CustomFormFieldProps {
  config: FormFieldConfig
  modelOptions?: Array<{ id: string; provider: string }>
  onSubmit: () => void
}

interface FieldRenderProps {
  field: {
    value: unknown
    onChange: (value: unknown) => void
  }
  config: FormFieldConfig
  modelOptions?: Array<{ id: string; provider: string }>
  onSubmit: () => void
}

const renderInputField = ({ field, config }: FieldRenderProps) => {
  const { inputType, placeholder, min } = config
  const isNumber = inputType === 'number'

  return (
    <Input
      type={inputType}
      placeholder={placeholder}
      min={isNumber ? min : undefined}
      {...field}
      value={
        isNumber ? String(field.value ?? '') : (field.value as string) || ''
      }
    />
  )
}

const renderSelectField = ({
  field,
  config,
  modelOptions
}: FieldRenderProps) => {
  const { placeholder } = config
  const isDisabled = modelOptions?.length === 1

  return (
    <Select
      value={String(field.value || '')}
      onValueChange={field.onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-full bg-accent/50 text-muted disabled:opacity-100">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {modelOptions?.map((model) => (
          <SelectItem
            key={`${model.id}-${model.provider}`}
            value={`${model.id}|${model.provider}`}
          >
            <div className="flex items-center gap-2">
              <Icon
                type={getProviderIcon(model.provider)}
                className="flex-shrink-0 text-muted"
                size="xs"
              />
              <Paragraph size="xsmall" className="truncate">
                {model.id}
              </Paragraph>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const renderTagInputField = ({ field, config }: FieldRenderProps) => {
  const { placeholder } = config

  return (
    <TagInput
      tags={Array.isArray(field.value) ? field.value : []}
      onTagsChange={field.onChange}
      placeholder={placeholder}
    />
  )
}

const renderTextareaField = ({ field, config, onSubmit }: FieldRenderProps) => {
  const form = useFormContext<FormData>()
  const { placeholder } = config
  const { isValid } = form.formState
  return (
    <Textarea
      placeholder={placeholder}
      className="min-h-[80px]"
      {...field}
      value={(field.value as string) || ''}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (isValid) onSubmit()
        }
      }}
    />
  )
}

const getFieldRenderer = (type: FormFieldConfig['type']) => {
  switch (type) {
    case 'input':
      return renderInputField
    case 'select':
      return renderSelectField
    case 'tag-input':
      return renderTagInputField
    case 'textarea':
      return renderTextareaField
    default:
      return renderTextareaField
  }
}

const CustomFormField: FC<CustomFormFieldProps> = memo(
  ({ config, modelOptions, onSubmit }) => {
    const form = useFormContext<FormData>()
    const { name, label, type, className } = config

    const fieldRenderer = useMemo(() => getFieldRenderer(type), [type])

    const renderField = useCallback(
      (field: FieldRenderProps['field']) =>
        fieldRenderer({ field, config, modelOptions, onSubmit }),
      [fieldRenderer, config, modelOptions]
    )

    const tooltipContent = TOOLTIP_CONTENT[label]

    return (
      <UIFormField
        control={form.control}
        name={name as keyof FormData}
        render={({ field }) => (
          <FormItem className={cn(className, 'overflow-visible')}>
            <div className="flex items-center gap-1 overflow-visible">
              <FormLabel optional={config?.optional}>{label}</FormLabel>
              {tooltipContent && (
                <Tooltip
                  content={tooltipContent}
                  side="top"
                  contentClassName="text-wrap break-words  max-w-[322px] normal-case"
                >
                  <span onClick={(e) => e.preventDefault()}>
                    <Icon type="info" size="xs" className="cursor-pointer" />
                  </span>
                </Tooltip>
              )}
            </div>
            <FormControl>{renderField(field)}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

export default CustomFormField

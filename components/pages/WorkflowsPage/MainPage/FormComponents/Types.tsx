import { Input } from '@/components/ui/input'
import TextInputField from './TextInputField'
import BooleanField from './BooleanField'
import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'

import type { InputSchemaPropertyItem } from '@/types/workflow'
import type { ChangeEvent } from 'react'

type PrimitiveFieldValue = string | number | boolean

type AnyOfItemType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'

interface TypesProps {
  fieldName: string
  field: InputSchemaPropertyItem & {
    anyOf?: Array<{ type: AnyOfItemType; description?: string; title?: string }>
  }
  isRequired: boolean
  value: PrimitiveFieldValue | ''
  onChange: (value: PrimitiveFieldValue | '') => void
  error?: string
}

/**
 * Component for rendering anyOf fields with multiple types
 * Handles different combinations of string, number, and boolean types
 */
const Types = ({
  fieldName,
  field,
  isRequired,
  value,
  onChange
}: TypesProps) => {
  const anyOfTypes: AnyOfItemType[] = (field.anyOf || []).map(
    (item) => item.type
  )
  const hasString = anyOfTypes.includes('string')
  const hasNumber =
    anyOfTypes.includes('number') || anyOfTypes.includes('integer')
  const hasBoolean = anyOfTypes.includes('boolean')

  const renderFieldLabel = () => (
    <div className="flex items-center gap-x-1">
      <span className="font-dmmono text-xs font-normal uppercase">
        {field.title || fieldName}
      </span>
      {isRequired && <span className="text-xs text-red-500">*</span>}
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
  )

  // String or Number
  if (hasString && hasNumber && !hasBoolean) {
    const defaultTextOrNumber: string | number =
      typeof value === 'number' ? value : typeof value === 'string' ? value : ''
    return (
      <div className="flex w-full flex-col gap-y-2">
        {renderFieldLabel()}
        <Input
          type="text"
          required={isRequired}
          defaultValue={defaultTextOrNumber}
          placeholder={`Enter ${field.title || fieldName} (text or number)`}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value)
          }}
          className="rounded-lg border-none bg-secondary"
        />
      </div>
    )
  }

  // String or Boolean
  if (hasString && hasBoolean && !hasNumber) {
    const defaultText: string =
      typeof value === 'string' ? value : typeof value === 'boolean' ? '' : ''
    return (
      <div className="flex w-full flex-col gap-y-2">
        {renderFieldLabel()}
        <div className="flex gap-x-2">
          <Input
            type="text"
            required={isRequired}
            defaultValue={defaultText}
            placeholder={`Enter ${field.title || fieldName} (text)`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value)
            }}
            className="flex-1 rounded-lg border-none bg-secondary"
          />
          <BooleanField
            label=""
            value={typeof value === 'boolean' ? value : false}
            onChange={(boolValue) => {
              onChange(boolValue)
            }}
          />
        </div>
      </div>
    )
  }

  // Number or Boolean
  if (hasNumber && hasBoolean && !hasString) {
    const defaultNumber: string | number =
      typeof value === 'number' ? value : typeof value === 'boolean' ? '' : ''
    return (
      <div className="flex w-full flex-col gap-y-2">
        {renderFieldLabel()}
        <div className="flex gap-x-2">
          <Input
            type="number"
            required={isRequired}
            defaultValue={defaultNumber}
            placeholder={`Enter ${field.title || fieldName} (number)`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange(Number(e.target.value))
            }}
            className="flex-1 rounded-lg border-none bg-secondary"
          />
          <BooleanField
            label=""
            value={typeof value === 'boolean' ? value : false}
            onChange={(boolValue) => {
              onChange(boolValue)
            }}
          />
        </div>
      </div>
    )
  }

  // String, Number, or Boolean
  if (hasString && hasNumber && hasBoolean) {
    const defaultMixed: string | number =
      typeof value === 'number' ? value : typeof value === 'string' ? value : ''
    return (
      <div className="flex w-full flex-col gap-y-2">
        {renderFieldLabel()}
        <div className="flex gap-x-2">
          <Input
            type="text"
            required={isRequired}
            defaultValue={defaultMixed}
            placeholder={`Enter ${field.title || fieldName} (text, number, or boolean)`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value)
            }}
            className="flex-1 rounded-lg border-none bg-secondary"
          />
          <BooleanField
            label=""
            value={typeof value === 'boolean' ? value : false}
            onChange={(boolValue) => {
              onChange(boolValue)
            }}
          />
        </div>
      </div>
    )
  }

  // Fallback to text input for other anyOf combinations
  return (
    <TextInputField
      label={field.title || fieldName}
      description={field.description}
      required={isRequired}
      defaultValue={typeof value === 'string' ? value : String(value)}
      placeholder={`Enter ${field.title || fieldName}`}
      onChange={(inputValue) => {
        onChange(inputValue)
      }}
    />
  )
}

export default Types

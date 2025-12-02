import { memo } from 'react'

import { Textarea } from '@/components/ui/textarea'
import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'

const TextInputField = memo(
  ({
    label,
    description,
    required = false,
    defaultValue,
    onChange,
    placeholder
  }: {
    label: string
    description?: string
    required?: boolean
    defaultValue?: string
    placeholder?: string
    onChange: (value: string) => void
  }) => (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex items-center gap-x-1">
        <span className="font-dmmono text-xs font-normal uppercase">
          {label}
        </span>
        {required && <span className="text-xs text-red-500">*</span>}
        {description && (
          <Tooltip
            content={description}
            delayDuration={0}
            side="top"
            contentClassName="max-w-xs"
          >
            <Icon type="info" size="xs" />
          </Tooltip>
        )}
      </div>
      <Textarea
        placeholder={placeholder}
        required={required}
        value={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border-none bg-secondary text-primary placeholder-muted/50"
      />
    </div>
  )
)
export default TextInputField
TextInputField.displayName = 'TextInputField'

import { memo } from 'react'

import { Switch } from '@/components/ui/switch'
import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'

const BooleanField = memo(
  ({
    label,
    description,
    required = false,
    value,
    onChange
  }: {
    label: string
    description?: string
    required?: boolean
    value: boolean
    onChange: (value: boolean) => void
  }) => (
    <div className="flex w-full flex-col justify-start gap-y-2">
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
      <div className="flex items-center gap-x-2">
        <Switch
          checked={value}
          onCheckedChange={onChange}
          className="text-muted/50"
        />
      </div>
    </div>
  )
)
export default BooleanField
BooleanField.displayName = 'BooleanField'

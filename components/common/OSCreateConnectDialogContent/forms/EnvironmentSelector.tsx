import React from 'react'

import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'
import Paragraph from '@/components/ui/typography/Paragraph'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormLabel } from '@/components/ui/form'
import { EnvironmentProtocol } from '../types'
import Icon from '@/components/ui/icon'
import { IconType } from '@/components/ui/icon/types'
import { ENVIRONMENT } from '@/constants'
import { PLAN_NAMES } from '@/constants/billing'

interface EnvironmentSelectorProps {
  value: EnvironmentProtocol
  onChange: (value: EnvironmentProtocol) => void
  className?: string
  liveDescriptionOverride?: string
  isPro?: boolean
  hasRemoteSlot?: boolean
  remoteOsMonthlyCostCents?: number
  currency?: string
  disabled?: boolean
}

interface EnvironmentCardProps {
  option: (typeof ENVIRONMENT_OPTIONS)[0]
  selected: boolean
  disabled?: boolean
  children: React.ReactNode
}

const EnvironmentCard = ({
  option,
  selected,
  disabled,
  children
}: EnvironmentCardProps) => {
  return (
    <label
      className={cn(
        'flex-1 cursor-pointer rounded-lg border bg-secondary/50 p-4 transition-colors',
        selected ? 'border-border-selected' : 'border-white/10',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Icon type={option.icon} size="xs" />
            <Paragraph size="lead" className="text-primary">
              {option.label}
            </Paragraph>
            {option?.isPro && (
              <Badge variant="brand">{PLAN_NAMES.STARTER.toUpperCase()}</Badge>
            )}
          </div>
          {children}
        </div>
        <RadioGroupItem
          value={option.value}
          disabled={disabled}
          className="mt-0.5"
        />
      </div>
    </label>
  )
}

const ENVIRONMENT_OPTIONS: {
  value: EnvironmentProtocol
  label: string
  description: string
  icon: IconType
  isPro?: boolean
}[] = [
  {
    value: ENVIRONMENT.LOCAL,
    label: 'Local',
    description: 'Connect to a local AgentOS running on your machine',
    icon: 'laptop'
  },
  {
    value: ENVIRONMENT.LIVE,
    label: 'Live',
    description: 'Connect to a live AgentOS running in your infrastructure',
    isPro: true,
    icon: 'globe-2'
  }
]

export const EnvironmentSelector = ({
  value,
  onChange,
  className,
  disabled
}: EnvironmentSelectorProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <FormLabel className="text-primary">ENVIRONMENT</FormLabel>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="flex w-full flex-row gap-4"
      >
        {ENVIRONMENT_OPTIONS.map((option) => (
          <EnvironmentCard
            key={option.value}
            option={option}
            selected={value === option.value}
            disabled={disabled}
          >
            <Paragraph size="xs" className="text-muted">
              {option.description}
            </Paragraph>
          </EnvironmentCard>
        ))}
      </RadioGroup>
    </div>
  )
}

export default EnvironmentSelector

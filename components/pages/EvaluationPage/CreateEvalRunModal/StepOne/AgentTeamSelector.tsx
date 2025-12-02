import { FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { useFetchOSConfig } from '@/hooks/os'
import { FC, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { FilterType } from '@/types/filter'
import type { EntityType } from '../type'

interface AgentTeamSelectorProps {
  onSelectionChange: (value: string) => void
  selectedValue: string
}

interface EntityItem {
  id: string
  name?: string
}

interface EntityGroupProps {
  items: EntityItem[]
  entityType: EntityType
}

const EntityGroup: FC<EntityGroupProps> = ({ items, entityType }) => {
  if (
    items.length === 0 ||
    (entityType !== FilterType.Agents && entityType !== FilterType.Teams)
  )
    return null

  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const id = item.id
        const name = item.name || id
        return (
          <SelectItem key={`${id}-${index}`} value={`${entityType}:${id}`}>
            <div className="flex items-center gap-4">
              <Icon type={entityType} className="text-muted" size="xs" />

              <Paragraph className="uppercase text-primary" size="label">
                {name}
              </Paragraph>
            </div>
          </SelectItem>
        )
      })}
    </div>
  )
}
const AgentTeamSelector = ({
  onSelectionChange,
  selectedValue
}: AgentTeamSelectorProps) => {
  const { data: osConfig } = useFetchOSConfig()

  const [searchParams] = useSearchParams()
  const componentType = searchParams.get('type') || 'all'

  const { agents, teams } = useMemo(
    () => ({
      agents: osConfig?.agents || [],
      teams: osConfig?.teams || []
    }),
    [osConfig]
  )

  const shouldShowAgents =
    componentType === 'agents' || componentType === 'all' || !componentType
  const shouldShowTeams =
    componentType === 'teams' || componentType === 'all' || !componentType
  const isDisabled = !(
    (shouldShowAgents && agents?.length > 0) ||
    (shouldShowTeams && teams?.length > 0)
  )

  return (
    <div className="flex flex-col gap-y-2">
      <FormLabel>Select an Agent/Team</FormLabel>
      <Select
        onValueChange={onSelectionChange}
        value={selectedValue}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              isDisabled ? 'No agent or team available' : 'No selection made'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {shouldShowAgents && (
            <EntityGroup items={agents} entityType={FilterType.Agents} />
          )}
          {shouldShowTeams && (
            <EntityGroup items={teams} entityType={FilterType.Teams} />
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default AgentTeamSelector

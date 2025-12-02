import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import type { Config, ConfigAccordionProps } from '@/types/config'
import type { BaseItemProps } from '../types'
import type { IconType } from '@/components/ui/icon'
import { cn } from '@/utils/cn'
import EmptyBadge from '@/components/common/Playground/RightSidebar/EmptyBadge'
import {
  ConfigWithTagListItem,
  ListBoxItem,
  UppercaseBadgeItem
} from './components'
import { SectionWrapper } from './components'

const SPECIAL_COMPONENTS = {
  Tools: 'Tools',
  Team: 'Team',
  Agent: 'Agent',
  Step: 'Step'
}

// Map config names to icons
const CONFIG_ICONS: Record<string, IconType> = {
  Model: 'brain-circuit-2',
  Tools: 'wrench',
  Sessions: 'messages-square',
  Memory: 'memory-stick',
  'System Message': 'align-left',
  Streaming: 'radio',
  Knowledge: 'book',
  Storage: 'folder-open',
  'Response Settings': 'settings-2',
  Reasoning: 'reasoning',
  'Default Tools': 'wrench',
  'Extra Messages': 'chat-bubble',
  Members: 'users',
  // Workflow-specific fields
  Description: 'align-left',
  'Input Schema': 'braces',
  'Workflow Id': 'name',
  'Db Id': 'name',
  Id: 'name',
  Step: 'workflow',
  Steps: 'workflow-steps'
}

const COMPONENT_MAP: Record<string, FC<BaseItemProps>> = {
  [SPECIAL_COMPONENTS.Tools]: UppercaseBadgeItem,
  [SPECIAL_COMPONENTS.Team]: ConfigWithTagListItem,
  [SPECIAL_COMPONENTS.Agent]: ConfigWithTagListItem,
  [SPECIAL_COMPONENTS.Step]: ConfigWithTagListItem
}

const defaultEmptyContent = <EmptyBadge />

export const ConfigAccordion: FC<ConfigAccordionProps> = ({
  configs = [],
  name,
  type = 'list',
  description,
  emptyContent = defaultEmptyContent,
  nestedContent,
  depth,
  showAccordion = true,
  icon,
  metadata
}) => {
  // Get icon from config or use the default mapping
  const configIcon = icon || (CONFIG_ICONS[name] as IconType | undefined)
  const renderConfigItem = useCallback(
    (config?: Config, empty?: boolean) => {
      const itemProps = { config, empty, depth }
      const Component = COMPONENT_MAP[name] || ListBoxItem

      return <Component {...(itemProps as BaseItemProps)} />
    },
    [name, depth]
  )

  const renderListContent = useMemo(
    () => (
      <div className={cn('flex flex-wrap gap-2')}>
        {configs.length > 0
          ? configs.map((config) => (
              <div key={config.id} className={cn(name !== 'Tools' && 'w-full')}>
                {renderConfigItem(config, false)}
              </div>
            ))
          : emptyContent}
      </div>
    ),
    [configs, name, renderConfigItem, emptyContent]
  )

  const renderParagraphContent = useMemo(
    () =>
      description ? (
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-sm leading-relaxed text-primary">{description}</p>
        </div>
      ) : (
        emptyContent
      ),
    [description, emptyContent]
  )

  const renderContent = useMemo(() => {
    if (nestedContent) return nestedContent
    if (type === 'list') return renderListContent
    return renderParagraphContent
  }, [nestedContent, type, renderListContent, renderParagraphContent])

  return (
    <div className="flex flex-col">
      <SectionWrapper
        title={name}
        showAccordion={showAccordion}
        icon={configIcon}
        metadata={metadata}
        headerContent={
          [
            SPECIAL_COMPONENTS.Team,
            SPECIAL_COMPONENTS.Agent,
            SPECIAL_COMPONENTS.Step
          ].includes(name) && configs.length > 0
            ? renderConfigItem(configs[0], false)
            : undefined
        }
        content={renderContent}
      />
    </div>
  )
}

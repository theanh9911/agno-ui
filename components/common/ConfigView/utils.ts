import {
  Config,
  ConfigAccordionProps,
  ListContentItem,
  AccordionMetadata
} from '@/types/config'
import type { AgentDetails, TeamDetails } from '@/types/os'
import { Tool } from '@/types/playground'

type Member = AgentDetails | TeamDetails

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const humanizeKey = (key: string): string => {
  // Convert snake_case or camelCase to Title Case labels
  const withSpaces = key
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
  return withSpaces
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

// recursive function to convert objects to list items
const objectToListItems = (obj: object): ListContentItem[] => {
  return Object.entries(obj)
    .sort(([a], [b]) => {
      // Always put 'instructions' last
      if (a === 'instructions') return 1
      if (b === 'instructions') return -1
      // Otherwise sort alphabetically
      return a.localeCompare(b)
    })
    .map(([key, value]) => {
      // Handle arrays
      if (Array.isArray(value)) {
        return {
          key,
          children: value.map((v) => stringifyValue(v))
        }
      }

      // Handle objects recursively
      if (typeof value === 'object' && value !== null) {
        return {
          key,
          children: objectToListItems(value)
        }
      }

      // Handle primitives
      return {
        key,
        value: stringifyValue(value)
      }
    })
}

const buildConfigsForObject = (
  name: string,
  obj: object | undefined,
  idPrefix: string
): Config[] => {
  if (!obj) return []

  const id = `${idPrefix}-${name.toLowerCase().replace(/\s+/g, '-')}`
  return [
    {
      id,
      name,
      lists: [
        {
          id,
          heading: '',
          content: objectToListItems(obj)
        }
      ]
    }
  ]
}

// Extract metadata for accordion headers
const extractMetadata = (
  name: string,
  component: Member,
  configs?: Config[]
): AccordionMetadata | undefined => {
  const lowerName = name.toLowerCase()

  // Model metadata - extract provider and model name
  if (lowerName === 'model' && component.model) {
    return {
      modelProvider: component.model.provider,
      modelName: component.model.model
    }
  }

  // Memory metadata - extract memory model if available
  if (lowerName === 'memory' && component.memory?.model) {
    return {
      modelProvider: component.memory.model.provider,
      modelName: component.memory.model.model
    }
  }

  // Tools count (for both "Tools" and "Default Tools")
  if ((lowerName === 'tools' || lowerName === 'default tools') && configs) {
    return {
      count: configs.length
    }
  }

  return undefined
}

// Build config items for an agent or team member
export const buildBaseConfigs = (
  component: Member,
  idPrefix: string
): ConfigAccordionProps[] => {
  const configs: ConfigAccordionProps[] = []

  const excludedKeys = new Set(['tools', 'name', 'members'])

  const tools =
    component?.tools?.tools?.map((tool: Tool, index: number) => ({
      id: `${idPrefix}-tool-${index}`,
      name: tool?.name ?? `Tool ${index + 1}`
    })) ?? []
  if (tools.length)
    configs.push({
      name: 'Tools',
      configs: tools,
      metadata: extractMetadata('Tools', component, tools)
    })

  // Reuse the generic property processor, but skip string paragraphs for agent/team
  const additional = processObjectProperties(
    component,
    excludedKeys,
    idPrefix,
    { includeStringsAsParagraphs: false }
  )

  // Add metadata to each config
  const additionalWithMetadata = additional.map((config) => ({
    ...config,
    metadata: extractMetadata(config.name, component, config.configs)
  }))

  configs.push(...additionalWithMetadata)

  return configs
}

// function to process any object's properties into config accordions
export const processObjectProperties = <T extends object>(
  obj: T,
  excludedKeys: Set<string>,
  idPrefix: string,
  options?: { includeStringsAsParagraphs?: boolean }
): ConfigAccordionProps[] => {
  const configs: ConfigAccordionProps[] = []
  const includeStrings = options?.includeStringsAsParagraphs ?? true

  Object.entries(obj)
    .filter(
      ([key, value]) =>
        !excludedKeys.has(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
    )
    .forEach(([key, value]) => {
      const name = humanizeKey(String(key))
      if (includeStrings && typeof value === 'string') {
        // Handle string values like description as paragraphs
        configs.push({
          name,
          type: 'paragraph',
          description: value,
          configs: []
        })
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle object values through normal processing
        const built = buildConfigsForObject(name, value, idPrefix)
        if (built.length) configs.push({ name, configs: built })
      }
    })

  return configs
}

import React from 'react'
import { cn } from '@/utils/cn'
import { ConfigAccordion } from '@/components/common/ConfigView/ConfigAccordion'
import type { AgentDetails, TeamDetails } from '@/types/os'
import { buildBaseConfigs } from './utils'
import { isTeam } from '@/utils/os'

// Recursive component renderer
const renderComponent = (
  component: AgentDetails | TeamDetails,
  depth: number = 0,
  index: number = 0
): React.ReactNode => {
  const componentId = `${component.id ?? component.name}-${depth}-${index}`
  const configs = buildBaseConfigs(component, componentId)

  // Define a priority map for known config names.
  // Lower numbers = higher priority in the sort order.
  // Anything not listed here will be pushed to the bottom later (via default 99).
  const sortOrder: Record<string, number> = {
    Model: 0, // Show "Model" first
    Tools: 1 // Show "Tools" second
  }

  // Copy configs into a new array and sort them based on the priority map above

  // ["Knowledge", "Memory", "Model", "Tools"] -> ["Model", "Tools", "Knowledge", "Memory"]
  const sortedConfigs = [...(configs ?? [])].sort((a, b) => {
    // Look up the order number for 'a'.
    // If its name isn’t in sortOrder, use 99 (put it at the bottom).
    const aOrder = sortOrder[a?.name as string] ?? 99
    const bOrder = sortOrder[b?.name as string] ?? 99

    // Compare the two priority numbers:
    // - If aOrder < bOrder, 'a' comes before 'b'.
    // - If aOrder > bOrder, 'a' comes after 'b'.
    // - If they’re equal, keep original order (stable sort).
    return aOrder - bOrder
  })

  // Agent config
  if (!isTeam(component)) {
    const agentContent = (
      <div
        className={cn(
          'flex flex-1 flex-col gap-y-4',
          depth > 0 && 'border-l border-border pl-4'
        )}
      >
        {sortedConfigs.map((config, configIndex) => (
          <ConfigAccordion
            key={`${componentId}-config-${configIndex}`}
            {...config}
            depth={depth}
          />
        ))}
      </div>
    )

    return depth === 0 ? (
      <div key={componentId} className="flex h-full flex-col gap-y-2">
        {agentContent}
      </div>
    ) : (
      <div key={componentId} className="flex flex-col gap-y-1">
        <ConfigAccordion
          name="Agent"
          type="list"
          configs={[
            {
              id: `${componentId}-header`,
              name: component.name ?? component.id,
              tags: ['member']
            }
          ]}
          depth={depth}
          nestedContent={agentContent}
        />
      </div>
    )
  }

  // Team config
  const team = component
  // Order: sub-teams first, then sub-agents
  const teamMembers = team.members ?? []
  const subTeams = teamMembers.filter((m) => isTeam(m))
  const subAgents = teamMembers.filter((m) => !isTeam(m))
  const members = [
    ...subTeams.map((member, memberIndex) =>
      renderComponent(member, depth + 1, memberIndex)
    ),
    ...subAgents.map((member, memberIndex) =>
      renderComponent(member, depth + 1, subTeams.length + memberIndex)
    )
  ]

  const teamContent = (
    <div
      className={cn(
        'flex flex-1 flex-col gap-y-4',
        depth > 0 && 'border-l border-border pl-4'
      )}
    >
      {members.length > 0 && (
        <ConfigAccordion
          key={`${componentId}-members`}
          name="Members"
          type="list"
          configs={[]}
          depth={depth}
          metadata={{ count: members.length }}
          nestedContent={
            <div className="flex w-full flex-col gap-3 rounded-[10px] bg-secondary/50 p-3">
              {members}
            </div>
          }
        />
      )}

      {sortedConfigs.map((config, configIndex) => (
        <ConfigAccordion
          key={`${componentId}-config-${configIndex}`}
          {...config}
          depth={depth}
        />
      ))}
    </div>
  )

  return depth === 0 ? (
    <div key={componentId} className="flex h-full flex-col gap-y-2">
      {teamContent}
    </div>
  ) : (
    <div key={componentId} className="flex flex-col gap-y-1">
      <ConfigAccordion
        name="Team"
        type="list"
        configs={[
          {
            id: `${componentId}-header`,
            name: team.name ?? team.id,
            tags: ['team', ...(team?.mode ? [team.mode] : [])]
          }
        ]}
        depth={depth}
        nestedContent={teamContent}
      />
    </div>
  )
}

type AgentTeamConfigViewProps = {
  data: AgentDetails | TeamDetails
}

const AgentTeamConfigView = ({ data }: AgentTeamConfigViewProps) => {
  if (!data) return null

  return <div className="pb-5">{renderComponent(data, 0, 0)}</div>
}

export default AgentTeamConfigView

import { cn } from '@/utils/cn'
import { AgentDetails, TeamDetails } from '@/types/os'
import { isTeam } from '@/utils/os'
import Icon from '@/components/ui/icon'
import { getProviderIcon } from '@/utils/modelProvider'
import { memo } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/HoverCard'
import { Badge } from '@/components/ui/badge'
import Paragraph from '@/components/ui/typography/Paragraph'

const ProviderIconDisplay = memo(({ provider }: { provider?: string }) => {
  if (!provider) return null
  const iconType = getProviderIcon(provider)
  if (!iconType) return null

  return (
    <div className="flex shrink-0 items-center justify-center rounded-[6px] border border-border bg-background p-[1.5px]">
      <Icon type={iconType} className="text-foreground h-[14px] w-[14px]" />
    </div>
  )
})

ProviderIconDisplay.displayName = 'ProviderIconDisplay'

interface TeamMembersListProps {
  members: (AgentDetails | TeamDetails)[]
  depth?: number
  className?: string
}

/**
 * Renders a list of team members, including nested teams indented.
 * @param members - Array of TeamMember or Team
 * @param depth - Indentation depth for nested teams (default 0)
 * @returns JSX.Element
 */
const TeamMembersList = ({
  members,
  depth = 0,
  className
}: TeamMembersListProps) => {
  if (!Array.isArray(members) || members?.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-y-1',
        depth > 0 && 'border-l border-border pl-2',
        className
      )}
    >
      {members?.map((member) => {
        const memberIsTeam = isTeam(member)
        const key = member.id
        const hasModel = member?.model?.model
        const hasTools = member.tools?.tools && member.tools.tools.length > 0
        const hasKnowledge = !!member.knowledge
        const hasMemory = !!member.memory
        const hasReasoning = !!member.reasoning?.reasoning
        const hasStreaming = !!member.streaming?.stream

        return (
          <div key={key}>
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div
                  className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5"
                  style={{ marginLeft: depth * 8 }}
                >
                  <Icon
                    type={memberIsTeam ? 'team' : 'agent'}
                    className="h-4 w-4 shrink-0"
                  />
                  <Paragraph
                    size="body"
                    className="max-w-[180px] truncate text-primary"
                  >
                    {member?.name}
                  </Paragraph>
                  {hasModel && member.model && (
                    <div className="ml-auto shrink-0">
                      <ProviderIconDisplay provider={member.model.provider} />
                    </div>
                  )}
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                align="start"
                sideOffset={12}
                className="w-[300px]"
              >
                <div className="flex flex-col gap-3">
                  {hasModel && member.model && (
                    <div className="flex items-center justify-between gap-3">
                      <Paragraph size="label" className="text-xs">
                        Model
                      </Paragraph>
                      <div className="flex items-center gap-1.5">
                        <Paragraph size="label" className="text-xs">
                          {member.model.model}
                        </Paragraph>
                        <ProviderIconDisplay provider={member.model.provider} />
                      </div>
                    </div>
                  )}
                  {hasTools && member.tools?.tools && (
                    <div className="flex flex-col gap-2">
                      <Paragraph size="label" className="text-xs">
                        Tools ({member.tools.tools.length})
                      </Paragraph>
                      <div className="flex flex-wrap gap-1.5">
                        {member.tools.tools.map((tool, idx) => (
                          <Badge key={idx} icon="tool" variant="secondary">
                            {tool.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasKnowledge && (
                    <div className="flex items-center justify-between gap-3">
                      <Paragraph size="label" className="text-xs">
                        Knowledge
                      </Paragraph>
                      <Paragraph size="label" className="text-xs">
                        Enabled
                      </Paragraph>
                    </div>
                  )}
                  {hasMemory && (
                    <div className="flex items-center justify-between gap-3">
                      <Paragraph size="label" className="text-xs">
                        Memory
                      </Paragraph>
                      <Paragraph size="label" className="text-xs">
                        Enabled
                      </Paragraph>
                    </div>
                  )}
                  {hasReasoning && (
                    <div className="flex items-center justify-between gap-3">
                      <Paragraph size="label" className="text-xs">
                        Reasoning
                      </Paragraph>
                      <Paragraph size="label" className="text-xs">
                        Enabled
                      </Paragraph>
                    </div>
                  )}
                  {hasStreaming && (
                    <div className="flex items-center justify-between gap-3">
                      <Paragraph size="label" className="text-xs">
                        Streaming
                      </Paragraph>
                      <Paragraph size="label" className="text-xs">
                        Enabled
                      </Paragraph>
                    </div>
                  )}
                  {memberIsTeam &&
                    member?.members &&
                    member?.members?.length > 0 && (
                      <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
                        <Paragraph size="label" className="text-xs">
                          Members
                        </Paragraph>
                        <Paragraph size="label" className="text-xs">
                          {member.members.length}
                        </Paragraph>
                      </div>
                    )}
                </div>
              </HoverCardContent>
            </HoverCard>
            {memberIsTeam && member?.members && member?.members?.length > 0 && (
              <div className="mt-1">
                <TeamMembersList
                  members={member?.members}
                  depth={depth + 1}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TeamMembersList

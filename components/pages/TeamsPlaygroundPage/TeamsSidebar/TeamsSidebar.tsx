import { useMemo, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

import { useTeamsQuery } from '@/hooks/playground/useTeamsQuery'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'

import TeamMembersList from './TeamMembersList'
import Paragraph from '@/components/ui/typography/Paragraph/Paragraph'
import RunsTable from '@/components/common/Playground/MessageAreaWrapper/RunsTable'
import Icon from '@/components/ui/icon'

import { TeamDetails } from '@/types/os'
import { PlaygroundConversation } from '@/types/playground'
import { Separator } from '@/components/ui/separator'

interface TeamsSidebarProps {
  conversations?: PlaygroundConversation[]
  activeRunId?: string | null
}

const TeamsSidebar = ({
  conversations = [],
  activeRunId = null
}: TeamsSidebarProps) => {
  const isMembersAccordionCollapsed = useTeamsPlaygroundStore(
    (state) => state.isMembersAccordionCollapsed
  )
  const setIsMembersAccordionCollapsed = useTeamsPlaygroundStore(
    (state) => state.setIsMembersAccordionCollapsed
  )

  const [isRunsAccordionCollapsed, setIsRunsAccordionCollapsed] =
    useState(false)

  const { selectedId } = usePlaygroundQueries()
  const { data: teams } = useTeamsQuery()
  const selectedTeamData = useMemo(
    () => teams?.find((team: TeamDetails) => team.id === selectedId),
    [teams, selectedId]
  )

  // usePlaygroundTeamURLLoader()

  return (
    <div className="flex-shrink-0 space-y-0 pr-6">
      {selectedTeamData?.members && selectedTeamData.members.length > 0 && (
        <div className="border-l-[1px] border-border pl-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="members"
            value={isMembersAccordionCollapsed ? '' : 'members'}
            onValueChange={(value) =>
              setIsMembersAccordionCollapsed(value === '')
            }
          >
            <AccordionItem value="members" className="border-b-0 border-border">
              <AccordionTrigger
                className="h-12 py-0"
                iconPosition="right"
                icon="chevron-down"
              >
                <div className="flex items-center gap-2">
                  <Icon type="team" className="h-4 w-4" />
                  <Paragraph size="body" className="text-primary">
                    Members
                  </Paragraph>
                </div>
              </AccordionTrigger>
              <AccordionContent className="max-h-[300px] overflow-y-auto overflow-x-hidden pb-3">
                <TeamMembersList members={selectedTeamData.members} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {conversations.length > 0 && (
        <>
          <div className="py-4">
            <Separator />
          </div>
          <div className="border-l-[1px] border-border pl-4">
            <Accordion
              type="single"
              collapsible
              defaultValue="runs"
              value={isRunsAccordionCollapsed ? '' : 'runs'}
              onValueChange={(value) =>
                setIsRunsAccordionCollapsed(value === '')
              }
            >
              <AccordionItem value="runs" className="border-b-0">
                <AccordionTrigger
                  className="h-12 py-0"
                  iconPosition="right"
                  icon="chevron-down"
                >
                  <Paragraph size="body" className="text-primary">
                    Runs
                  </Paragraph>
                </AccordionTrigger>
                <AccordionContent className="max-h-[300px] overflow-y-auto pb-3">
                  <RunsTable
                    items={conversations}
                    activeRunId={activeRunId}
                    getRunId={(c) => c.run_id}
                    getLabel={(c) => c.user_message.content}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </div>
  )
}

export default TeamsSidebar

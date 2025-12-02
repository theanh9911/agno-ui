import TeamsSidebar from '@/components/pages/TeamsPlaygroundPage/TeamsSidebar/TeamsSidebar'
import WorkflowsSidebar from '@/components/pages/WorkflowsPage/WorkflowSidebar/WorkflowsSidebar'
import RunsTable from '@/components/common/Playground/MessageAreaWrapper/RunsTable'
import { useAgentsPlaygroundStore } from '@/stores/playground'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import { useFilterType } from '@/hooks/useFilterType'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { MEDIA_SESSION_NAME } from '@/constants'
import { useWorkflowRunsForSession } from '@/hooks/workflows/useWorkflowRunsForSession'

const ChatRightChildren = () => {
  // Use reactive selectors instead of entire store to prevent re-renders
  const agentsMessages = useAgentsPlaygroundStore((s) => s.messages)
  const teamsMessages = useTeamsPlaygroundStore((s) => s.messages)
  const { isTeam, isWorkflow } = useFilterType()
  const { selectedId, session } = usePlaygroundQueries()

  // Get merged runs for current session using the hook
  const { mergedRuns: messages } = useWorkflowRunsForSession(session)

  const conversations = isTeam ? teamsMessages : agentsMessages

  return (
    <div className="absolute bottom-0 right-0 top-2 hidden h-fit w-[288px] gap-4 overflow-hidden pt-[72px] xl:flex xl:flex-col">
      {isTeam && (
        <TeamsSidebar
          conversations={conversations}
          activeRunId={conversations[0]?.run_id || null}
        />
      )}
      {isWorkflow && selectedId && (
        <WorkflowsSidebar
          items={messages}
          activeRunId={messages[0]?.run_id || null}
        />
      )}
      {!isWorkflow && !isTeam && (
        <div className="sticky h-fit max-h-[calc(100vh-200px)] overflow-y-auto pr-6">
          <RunsTable
            items={conversations}
            activeRunId={conversations[0]?.run_id || null}
            getRunId={(c) => c.run_id}
            getLabel={(c) => c.user_message.content || MEDIA_SESSION_NAME}
          />
        </div>
      )}
    </div>
  )
}

export default ChatRightChildren

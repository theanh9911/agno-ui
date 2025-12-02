import { useEffect } from 'react'
import { useParams } from '@/utils/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSessionStore } from '@/stores/SessionsStore'
import { type DefaultPageParams } from '@/types/globals'
import { Tab } from '../../types'
import { useRunsQuery } from '@/hooks/sessions'
import { Separator } from '@/components/ui/separator'
import { useFilterType } from '@/hooks/useFilterType'

const SessionTabs = () => {
  const { isLoading } = useRunsQuery()
  const currentTab = useSessionStore((state) => state.currentTab)
  const setCurrentTab = useSessionStore((state) => state.setCurrentTab)
  const { id, agent } = useParams<DefaultPageParams>()
  const { isWorkflow } = useFilterType()

  useEffect(() => {
    setCurrentTab(Tab.Run)
  }, [id, agent, setCurrentTab])

  return (
    <>
      <Tabs
        value={currentTab}
        onValueChange={(tab) => setCurrentTab(tab as Tab)}
      >
        <TabsList>
          <TabsTrigger value={Tab.Run} disabled={isLoading}>
            Runs
          </TabsTrigger>

          {!isWorkflow && (
            <TabsTrigger value={Tab.Summary} disabled={isLoading}>
              Summary
            </TabsTrigger>
          )}

          <TabsTrigger value={Tab.Metrics} disabled={isLoading}>
            Metrics
          </TabsTrigger>

          {/* {isTeam && (
          <TabsTrigger value={Tab.Team} disabled={isLoading}>
            Team
          </TabsTrigger>
        )} */}
          <TabsTrigger value={Tab.Details} disabled={isLoading}>
            Details
          </TabsTrigger>
        </TabsList>
        <Separator className="mt-[-1.5px]" />
      </Tabs>
    </>
  )
}
export default SessionTabs

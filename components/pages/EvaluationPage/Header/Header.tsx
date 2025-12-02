import HeaderWrapper from '@/components/layouts/Header/HeaderWrapper'
import { ViewFilter } from './Filters'
import { SwitchTab, type TabOption } from './Filters/SwitchTab'
import SortFilter from '@/components/common/Filters/SortFilter'
import { SortFilterType } from '@/types/filter'
import { useEvalsRunsQuery } from '@/hooks/evals'
import DatabaseSelector from '@/components/common/DatabaseSelector'
import { useFetchOSConfig } from '@/hooks/os'

const Header = () => {
  const { availableModels } = useEvalsRunsQuery()
  const { data: osConfig } = useFetchOSConfig()
  const showDatabaseSelector = Boolean(
    osConfig && osConfig.evals?.dbs.length > 0
  )

  const evaluationTabs: TabOption[] = [
    {
      value: 'agents',
      label: 'Agents',
      icon: 'agent',
      className: 'w-[85px]'
    },
    {
      value: 'teams',
      label: 'Teams',
      icon: 'team',
      className: 'w-[85px]'
    },
    {
      value: 'all',
      label: 'All',
      className: 'w-[40px]'
    }
  ]

  return (
    <HeaderWrapper
      bottomContent={{
        ...(showDatabaseSelector && {
          leftContent: (
            <div className="flex flex-col">
              <DatabaseSelector />
            </div>
          )
        }),
        rightContent: (
          <div className="flex gap-4">
            <ViewFilter availableModels={availableModels} />
            <SortFilter type={SortFilterType.UPDATED_AT} />
            <SwitchTab tabs={evaluationTabs} defaultValue="all" />
          </div>
        )
      }}
    />
  )
}

export default Header

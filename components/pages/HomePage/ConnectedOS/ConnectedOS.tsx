import ExplorePage from './ExplorePage'
import ComponentList from './ComponentList'
import { useFetchOSConfig } from '@/hooks/os'
import { ConnectedOSSkeleton } from '../BlankState'
import { useMemo, memo } from 'react'

const ConnectedOS = () => {
  const { data: osConfig, isLoading } = useFetchOSConfig()
  const componentSections = useMemo(
    () => [
      { key: 'agents', title: 'Agents', data: osConfig?.agents },
      { key: 'teams', title: 'Teams', data: osConfig?.teams },
      { key: 'workflows', title: 'Workflows', data: osConfig?.workflows },
      { key: 'interfaces', title: 'Interfaces', data: osConfig?.interfaces }
    ],
    [osConfig]
  )

  return (
    <div className="flex w-full flex-col gap-y-4 pb-4">
      <ExplorePage />
      {isLoading ? (
        <ConnectedOSSkeleton />
      ) : (
        <>
          {componentSections.map(({ key, title, data }) =>
            data && data.length > 0 ? (
              <ComponentList key={key} list={data} title={title} />
            ) : null
          )}
        </>
      )}
    </div>
  )
}

export default memo(ConnectedOS)

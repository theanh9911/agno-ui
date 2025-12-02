import HeaderWrapper from '@/components/layouts/Header/HeaderWrapper'
import DatabaseSelector from '@/components/common/DatabaseSelector'

import { SortFilterType } from '@/types/filter'
import SortFilter from '@/components/common/Filters/SortFilter'
import { useFetchOSConfig } from '@/hooks/os'

const Header = () => {
  const { data: osConfig } = useFetchOSConfig()
  const showDatabaseSelector = Boolean(
    osConfig && osConfig.knowledge?.dbs.length > 0
  )

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
            <SortFilter type={SortFilterType.UPDATED_AT} />
          </div>
        )
      }}
      className="w-full"
    />
  )
}

export default Header

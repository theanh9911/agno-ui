import HeaderWrapper from '@/components/layouts/Header/HeaderWrapper'
import DatabaseSelector from '@/components/common/DatabaseSelector'
import { useFetchOSConfig } from '@/hooks/os'

const UserHeader = () => {
  const { data: osConfig } = useFetchOSConfig()
  const showDatabaseSelector = Boolean(
    osConfig && osConfig.memory?.dbs?.length > 0
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
        })
      }}
      className="w-full"
    />
  )
}

export default UserHeader

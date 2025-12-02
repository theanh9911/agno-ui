import React from 'react'
import HeaderRightContent from './HeaderRightContent'
import { HeaderWrapper } from '@/components/layouts/Header'
import DatabaseSelector from '@/components/common/DatabaseSelector'
import { useFetchOSConfig } from '@/hooks/os'

const SessionHeaderWrapper = () => {
  const { data: osConfig } = useFetchOSConfig()
  const showDatabaseSelector = Boolean(
    osConfig && osConfig.session?.dbs.length > 0
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
        rightContent: <HeaderRightContent />
      }}
    />
  )
}

export default SessionHeaderWrapper

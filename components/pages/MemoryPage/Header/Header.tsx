import HeaderWrapper from '@/components/layouts/Header/HeaderWrapper'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Icon from '@/components/ui/icon'
import SortFilter from '../../../common/Filters/SortFilter'
import DatabaseSelector from '@/components/common/DatabaseSelector'
import UserSelector from './UserSelector'
import { useGetAllMemoryUsers } from '@/hooks/memory/useGetAllMemoryUsers'
import { useParams, useRouter } from '@/utils/navigation'
import { useMemo } from 'react'
import { SortFilterType } from '@/types/filter'
import { useFetchOSConfig } from '@/hooks/os'

const Header = () => {
  const params = useParams<{ '*'?: string }>()
  // The route is defined as memory/* (splat route), so userId is captured as params['*']
  const userId = params['*']
  const router = useRouter()
  const { data: memoryUsersResponse } = useGetAllMemoryUsers()
  const { data: osConfig } = useFetchOSConfig()

  const userIds = useMemo(() => {
    return memoryUsersResponse?.data?.map((user) => user.user_id) || []
  }, [memoryUsersResponse])

  const handleUserSelect = (selectedUserId: string) => {
    const currentSearch = router?.search || ''
    router.push(`/memory/${selectedUserId}${currentSearch}`)
  }

  const handleBackClick = () => {
    router.push('/memory')
  }

  const showDatabaseSelector = osConfig && osConfig.memory?.dbs.length > 0
  const showUserSelector = userIds && userIds.length > 0

  return (
    <HeaderWrapper
      bottomContent={{
        ...((showDatabaseSelector || showUserSelector) && {
          leftContent: (
            <div className="flex w-full items-end gap-2">
              <Button
                variant="ghost"
                size="iconBreadcrumb"
                onClick={handleBackClick}
                className="hover:bg-transparent"
                icon="caret-left"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {showDatabaseSelector && <DatabaseSelector />}
                  {showDatabaseSelector && showUserSelector && (
                    <BreadcrumbSeparator className="mb-1.5 self-end">
                      <Icon type="slash" size="xs" className="text-primary" />
                    </BreadcrumbSeparator>
                  )}
                  {showUserSelector && (
                    <UserSelector
                      userIds={userIds}
                      onUserSelect={handleUserSelect}
                      selectedUserId={userId}
                    />
                  )}
                </BreadcrumbList>
              </Breadcrumb>
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

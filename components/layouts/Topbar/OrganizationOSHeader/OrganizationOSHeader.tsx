import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Icon from '@/components/ui/icon'
import { TopbarBreadcrumbType } from '@/types/filter'
import { OrganizationSelector } from '../OrganizationSelector'
import { OSSelector } from '../OSSelector'
import { useCurrentOrganization } from '@/api/hooks/queries'

interface OrganizationOSHeaderProps {
  groupsToShow?: TopbarBreadcrumbType[]
}

const OrganizationOSHeader = ({
  groupsToShow = [TopbarBreadcrumbType.ORGANIZATION, TopbarBreadcrumbType.OS]
}: OrganizationOSHeaderProps) => {
  const showOrganization = groupsToShow.includes(
    TopbarBreadcrumbType.ORGANIZATION
  )
  const { data: currentOrganization } = useCurrentOrganization()
  const showOS = groupsToShow.includes(TopbarBreadcrumbType.OS)

  return currentOrganization ? (
    <div className="relative flex w-full flex-shrink-0 items-center gap-2">
      <Breadcrumb className="w-full">
        <BreadcrumbList>
          {showOrganization && <OrganizationSelector />}

          {showOrganization && showOS && (
            <BreadcrumbSeparator>
              <Icon type="slash" size="xs" className="text-muted/40" />
            </BreadcrumbSeparator>
          )}

          {showOS && <OSSelector />}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ) : null
}

export default OrganizationOSHeader

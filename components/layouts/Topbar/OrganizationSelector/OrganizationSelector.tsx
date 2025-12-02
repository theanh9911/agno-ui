import { Avatar } from '@/components/ui/avatar'
import { getInitials } from '@/utils/user'
import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'
import { useOrganizationsList } from '@/api/hooks/queries'
import { useCurrentOrganization } from '@/api/hooks/queries'
import { useChangeOrganization } from '@/api/hooks'
import { useRestrictionOverlay } from '@/components/common/RestrictionOverlay'
import { OrganizationSwitchingOverlay } from '@/components/common/OrganizationSwitchingOverlay'
import { useNavigate } from 'react-router-dom'
import Paragraph from '@/components/ui/typography/Paragraph'
import { BreadcrumbTextItem } from '@/components/ui/breadcrumb'
import { useDialog } from '@/providers/DialogProvider'
import CreateOrganizationModal from '@/components/common/CreateOrganizationModal'

interface OrganizationItemProps {
  organization: {
    id: string
    name?: string | null
  }
}

const OrganizationItem = ({ organization }: OrganizationItemProps) => (
  <div className="flex items-center gap-x-2 overflow-hidden">
    <Avatar variant="outline">
      {organization.name && getInitials(organization.name)}
    </Avatar>

    <Paragraph size="body" className="truncate text-primary">
      {organization.name}
    </Paragraph>
  </div>
)

const OrganizationSelector = () => {
  const { data: currentOrganization } = useCurrentOrganization()
  const { data: organizationsList } = useOrganizationsList()
  const { openDialog } = useDialog()
  const { show, hide } = useRestrictionOverlay()
  const navigate = useNavigate()
  const changeOrganizationMutation = useChangeOrganization()

  const switchToOrganization = async (orgId: string, orgName: string) => {
    show(<OrganizationSwitchingOverlay organizationName={orgName} />)

    try {
      await changeOrganizationMutation.mutateAsync(orgId)
    } catch {
      hide()
    } finally {
      setTimeout(() => {
        hide()
        navigate('/', { replace: true })
      }, 300)
    }
  }

  const comboboxItems =
    organizationsList?.map((org) => ({
      value: org.id,
      label: <OrganizationItem organization={org} />,
      name: org.name
    })) || []

  const selectedItem = !currentOrganization
    ? { value: '', label: '' }
    : {
        value: currentOrganization.id,
        label: (
          <div className="flex items-center gap-2">
            <Avatar variant="outline">
              {getInitials(currentOrganization.name)}
            </Avatar>
            <BreadcrumbTextItem>{currentOrganization.name}</BreadcrumbTextItem>
          </div>
        ),
        name: currentOrganization.name
      }

  const handleItemSelect = (orgId: string) => {
    const selectedOrg = organizationsList?.find((org) => org.id === orgId)
    if (selectedOrg && selectedOrg.id !== currentOrganization?.id) {
      switchToOrganization(selectedOrg.id, selectedOrg.name || '')
    }
  }

  if (!currentOrganization?.name) {
    return null
  }

  return (
    <BreadcrumbCombobox
      selectedItem={selectedItem}
      itemList={comboboxItems}
      onItemSelect={handleItemSelect}
      header={{
        title: 'Organization',
        actions: [
          {
            onClick: () => openDialog(<CreateOrganizationModal />),
            icon: 'plus' as const
          }
        ]
      }}
      popoverWidth="w-[253px]"
    />
  )
}

export default OrganizationSelector

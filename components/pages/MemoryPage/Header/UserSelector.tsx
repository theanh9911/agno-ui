import { useMemo } from 'react'
import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Paragraph from '@/components/ui/typography/Paragraph'

interface UserSelectorProps {
  userIds: string[]
  onUserSelect: (userId: string) => void
  selectedUserId?: string
}

const UserSelector = ({
  userIds,
  onUserSelect,
  selectedUserId
}: UserSelectorProps) => {
  if (!userIds || userIds.length === 0) {
    return null
  }

  const userOptions = useMemo(
    () =>
      userIds.map((userId) => ({
        value: userId,
        label: userId
      })),
    [userIds]
  )

  return (
    <Breadcrumb className="flex flex-col gap-0">
      <Paragraph size="xsmall" className="ml-1 text-muted">
        User ID
      </Paragraph>

      <BreadcrumbCombobox
        selectedItem={{
          value: selectedUserId || '',
          label: selectedUserId || 'Select User'
        }}
        itemList={userOptions}
        onItemSelect={onUserSelect}
      />
    </Breadcrumb>
  )
}

export default UserSelector

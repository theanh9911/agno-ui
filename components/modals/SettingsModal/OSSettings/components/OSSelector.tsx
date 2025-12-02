import React from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useOSQuery } from '@/api/hooks'
import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'
import Icon from '@/components/ui/icon'
import { Avatar } from '@/components/ui/avatar'
import { BreadcrumbTextItem } from '@/components/ui/breadcrumb'
import { OSResponse } from '@/api/generated'
import { TagList } from '@/components/common/TagControls'
import Paragraph from '@/components/ui/typography/Paragraph'

interface OSItemProps {
  os: OSResponse
}

const OSItem = ({ os }: OSItemProps) => (
  <div className="flex w-full cursor-pointer items-center gap-x-2 overflow-hidden">
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <Avatar variant="outline">
        <Icon type={os.is_remote ? 'globe-2' : 'laptop'} size="xs" />
      </Avatar>
      <Paragraph size="body" className="truncate text-primary">
        {os?.name || os?.endpoint_url}
      </Paragraph>
    </div>
    {os?.tags && <TagList tags={os?.tags || []} />}
  </div>
)

const OSSelector = () => {
  const { selectedOS, setSelectedOS } = useOSStore()
  const { data: osList } = useOSQuery()

  const handleOSSelect = (osId: string) => {
    const selectedOS = osList?.find((os) => os.id === osId) || osList?.[0]
    if (selectedOS) {
      setSelectedOS(selectedOS)
    }
  }

  const comboboxItems =
    osList
      ?.filter((endpoint) => endpoint.id)
      .map((endpoint) => ({
        value: endpoint.id!,
        label: <OSItem os={endpoint} />
      })) || []

  const selectedItem = {
    value: selectedOS?.id ?? '',
    label: (
      <div className="flex items-center gap-2">
        <Avatar variant="outline">
          <Icon type={selectedOS?.is_remote ? 'globe-2' : 'laptop'} size="xs" />
        </Avatar>
        <BreadcrumbTextItem>
          {selectedOS?.name || selectedOS?.endpoint_url}
        </BreadcrumbTextItem>
      </div>
    )
  }

  return selectedItem?.value ? (
    <BreadcrumbCombobox
      selectedItem={selectedItem}
      itemList={comboboxItems}
      onItemSelect={handleOSSelect}
      popoverWidth="w-[394px]"
    />
  ) : null
}

export default OSSelector

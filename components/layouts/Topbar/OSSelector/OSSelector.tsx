import { useCallback } from 'react'
import { useOSStore } from '@/stores/OSStore'
import { useOSQuery } from '@/api/hooks'
import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'
import { OSCreateConnectDialogModeType } from '@/types/os'
import OSConnectDialogContent from '@/components/common/OSCreateConnectDialogContent/OSConnectDialogContent'
import { useDialog } from '@/providers/DialogProvider'
import Icon from '@/components/ui/icon'
import { BreadcrumbTextItem } from '@/components/ui/breadcrumb'
import { cn } from '@/utils/cn'
import Status from '@/components/common/Status'
import { useFetchOSStatus } from '@/hooks/os'
import { Avatar } from '@/components/ui/avatar'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Button } from '@/components/ui/button'
import { OSResponse } from '@/api/generated'
import { TagList } from '@/components/common/TagControls'

const EMPTY_STATE_LABEL = 'Add AgentOS'

interface OSItemProps {
  endpoint: OSResponse
  onEdit: (os: OSResponse, e: React.MouseEvent<HTMLButtonElement>) => void
}

const OSItem = ({ endpoint, onEdit }: OSItemProps) => (
  <div className="flex w-full cursor-pointer items-center justify-between gap-x-2 overflow-hidden">
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <Avatar variant="outline">
        <Icon type={endpoint.is_remote ? 'globe-2' : 'laptop'} size="xs" />
      </Avatar>

      <Paragraph size="body" className="truncate text-primary">
        {endpoint?.name || endpoint?.endpoint_url}
      </Paragraph>
    </div>

    {endpoint?.tags && <TagList tags={endpoint?.tags || []} />}

    <Button
      icon="edit"
      variant="ghost"
      size="iconSmall"
      onClick={(e) => onEdit(endpoint, e)}
      className="pointer-events-auto flex-shrink-0"
      aria-label={`Edit ${endpoint.name || endpoint.endpoint_url}`}
    />
  </div>
)

interface OSSelectorProps {
  className?: string
}

const OSSelector = ({ className }: OSSelectorProps) => {
  const { currentOS, setCurrentOS, setOSBeingEdited } = useOSStore()
  const { data: isOsAvailable } = useFetchOSStatus()
  const { openDialog } = useDialog()
  const { data: osList } = useOSQuery()

  const handleEditOS = useCallback(
    (os: OSResponse, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setOSBeingEdited(os)
      openDialog(
        <OSConnectDialogContent
          initialMode={OSCreateConnectDialogModeType.EDIT}
          editingOS={os}
        />
      )
    },
    [openDialog, setOSBeingEdited]
  )

  const handleOSSelect = (osId: string) => {
    const selectedOS = osList?.find((os) => os.id === osId)
    if (selectedOS) {
      setCurrentOS(selectedOS)
    }
  }

  const comboboxItems =
    osList
      ?.filter((endpoint) => endpoint.id)
      .map((endpoint) => ({
        value: endpoint.id!,
        label: <OSItem endpoint={endpoint} onEdit={handleEditOS} />,
        name: endpoint?.name || endpoint?.endpoint_url || ''
      })) || []

  const selectedItem =
    !currentOS?.endpoint_url || !currentOS.id
      ? { value: '', label: EMPTY_STATE_LABEL, name: EMPTY_STATE_LABEL }
      : {
          value: currentOS.id,
          label: (
            <div className="flex items-center gap-2">
              <Avatar variant="outline">
                <Icon
                  type={currentOS.is_remote ? 'globe-2' : 'laptop'}
                  size="xs"
                />
              </Avatar>
              <BreadcrumbTextItem>
                {currentOS.name || currentOS.endpoint_url}
              </BreadcrumbTextItem>
              <Status status={!!isOsAvailable} />
            </div>
          ),
          name: currentOS.name || currentOS.endpoint_url
        }

  const hasOSList = Boolean(osList?.length)

  const handleOSConnect = () => {
    openDialog(
      <OSConnectDialogContent
        initialMode={OSCreateConnectDialogModeType.CONNECT}
      />
    )
  }

  return (
    <div className={cn('flex items-center', className)}>
      {hasOSList ? (
        <BreadcrumbCombobox
          selectedItem={selectedItem}
          itemList={comboboxItems}
          onItemSelect={handleOSSelect}
          header={{
            title: 'AgentOS',
            actions: [
              {
                onClick: () =>
                  openDialog(
                    <OSConnectDialogContent
                      initialMode={OSCreateConnectDialogModeType.CONNECT}
                    />
                  ),
                icon: 'plus' as const
              }
            ]
          }}
          popoverWidth="w-[394px]"
        />
      ) : (
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent p-0"
          onClick={handleOSConnect}
        >
          <BreadcrumbTextItem className="text-primary">
            {selectedItem.label}
          </BreadcrumbTextItem>
          <Icon type="plus" size="xxs" className="text-primary" />
        </button>
      )}
    </div>
  )
}

export default OSSelector

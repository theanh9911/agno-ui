import { cn } from '@/utils/cn'
import OrganizationOSHeader from './OrganizationOSHeader'
import { RefreshButton } from '@/components/common/RefreshButton'
import { useGlobalRefresh } from '@/hooks/refresh'

const Topbar = () => {
  const { refresh, isLoading } = useGlobalRefresh()

  return (
    <div
      className={cn(
        'flex h-14 w-full flex-shrink-0 items-center justify-between border-b border-border px-2 py-3'
      )}
    >
      <div className="flex items-center gap-2">
        <OrganizationOSHeader />
      </div>
      <RefreshButton
        text="REFRESH"
        variant={'secondary'}
        size={'sm'}
        onClick={refresh}
        disabled={isLoading}
        label="Refresh page"
      />
    </div>
  )
}

export default Topbar

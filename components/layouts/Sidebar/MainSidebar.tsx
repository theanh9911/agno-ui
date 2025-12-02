import { type FC, useMemo, useEffect } from 'react'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import { SidebarItems } from './SidebarItems'
import { SIDEBAR_ITEMS } from './constants'
import SidebarActiveIndicator from './SidebarItems/SidebarActiveIndicator'
import { useSidebarActiveIndicator } from '@/components/layouts/Sidebar/hooks/useSidebarActiveIndicator'
import SettingsModal from '@/components/modals/SettingsModal/SettingsModal'
import { useUser } from '@/api/hooks/queries'
import { useRoutePrefetch } from '@/hooks/useRoutePrefetch'
import { useDialog } from '@/providers/DialogProvider'
import SidebarUserSection from './SidebarUserSection'

const MainSidebar: FC = () => {
  const { openDialog } = useDialog()
  const { prefetchAllRoutes } = useRoutePrefetch()
  const isTracesEnabled = useFeatureFlagEnabled('feat-traces')

  const sectionsWithHandlers = useMemo(() => {
    return SIDEBAR_ITEMS.primary.sections.map((section) => ({
      ...section,
      items: section.items
        .filter((item) => {
          if (item.label === 'Traces' && !isTracesEnabled) {
            return false
          }
          return true
        })
        .map((item) => {
          if (item.label === 'Settings') {
            return {
              ...item,
              onClick: () => openDialog(<SettingsModal />)
            }
          }
          return item
        })
    }))
  }, [isTracesEnabled, openDialog])

  const allSidebarItems = useMemo(() => {
    return sectionsWithHandlers.flatMap((section) => section.items)
  }, [sectionsWithHandlers])

  const { sidebarRef, activeIndicatorTop, ACTIVE_INDICATOR_HEIGHT } =
    useSidebarActiveIndicator(allSidebarItems)
  const { data } = useUser()
  const organizations = data?.organizations
  const hasOrganizations = !!organizations?.length

  useEffect(() => {
    prefetchAllRoutes()
  }, [prefetchAllRoutes])

  return (
    <div
      ref={sidebarRef}
      className="relative flex h-full min-h-0 w-[195px] shrink-0 flex-col gap-y-5 border-r border-border pt-2"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {sectionsWithHandlers.map((section, index) => (
          <SidebarItems
            key={index}
            items={section.items}
            divider={index !== sectionsWithHandlers.length - 1}
            dividerMargin="m-2"
            isSidebarInactive={!hasOrganizations}
          />
        ))}

        <div className="mt-auto">
          {SIDEBAR_ITEMS.secondary.sections.map((section, index) => (
            <SidebarItems
              key={index}
              items={section.items}
              variant="secondary"
              rightIconType="arrow-up-right"
            />
          ))}

          <div className="mt-2 border-t border-border">
            <SidebarUserSection />
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {hasOrganizations && (
        <SidebarActiveIndicator
          top={activeIndicatorTop}
          height={ACTIVE_INDICATOR_HEIGHT}
        />
      )}
    </div>
  )
}

export default MainSidebar

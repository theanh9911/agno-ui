import React, { useState, useEffect, useRef } from 'react'

import { SidebarItem } from '@/types/globals'
import SidebarDivider from '@/components/layouts/Sidebar/SidebarItems/SidebarDivider'
import SidebarActiveIndicator from '@/components/layouts/Sidebar/SidebarItems/SidebarActiveIndicator'
import { SETTINGS_SIDEBAR_ITEMS } from '@/components/layouts/Sidebar/constants'
import { Avatar } from '@/components/ui/avatar'
import { SettingsModalSidebarItems } from './SettingsModalSidebarItems'
import { useCurrentOrganization } from '@/api/hooks/queries'

interface SettingsModalSidebarProps {
  currentPage: string
  isOpen: boolean
  onPageChange: (page: string) => void
}

export const SettingsModalSidebar: React.FC<SettingsModalSidebarProps> = ({
  currentPage,
  isOpen,
  onPageChange
}) => {
  const [activeIndicatorTop, setActiveIndicatorTop] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { data: currentOrganization } = useCurrentOrganization()

  const ACTIVE_INDICATOR_HEIGHT = 36
  const ACTIVE_INDICATOR_OFFSET = 4

  // Calculate active indicator position based on current page
  useEffect(() => {
    if (!isOpen || !sidebarRef.current) {
      setActiveIndicatorTop(0)
      return
    }

    const calculatePosition = () => {
      if (!sidebarRef.current) return

      // Find the button with the matching data-page attribute
      const activeButton = sidebarRef.current.querySelector(
        `button[data-page="${currentPage}"]`
      )

      if (activeButton) {
        const buttonRect = activeButton.getBoundingClientRect()

        // Get the main sidebar container by traversing up from the items container
        let mainSidebar = sidebarRef.current.parentElement
        while (mainSidebar && !mainSidebar.classList.contains('relative')) {
          mainSidebar = mainSidebar.parentElement
        }

        if (mainSidebar) {
          const mainSidebarRect = mainSidebar.getBoundingClientRect()
          const indicatorTop = Math.round(
            buttonRect.top - mainSidebarRect.top - ACTIVE_INDICATOR_OFFSET
          )

          setActiveIndicatorTop(indicatorTop)
        }
      }
    }

    // Use a longer delay to ensure all DOM updates and transitions are complete
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(calculatePosition)
        })
      })
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [currentPage, isOpen])

  return (
    <div className="relative flex h-full min-w-[248px] max-w-[248px] flex-col border-r border-border pt-1">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            {currentOrganization?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <span className="text-foreground font-sm line-clamp-2 max-w-[120px] overflow-hidden text-sm">
            {currentOrganization?.name}
          </span>
          {/* TODO[billing](RS) - Hardcoding this for now. Make dynamic when billing is introduced */}
          {/* <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
            PRO
          </span> */}
        </div>
      </div>
      <SidebarDivider margin="mx-2" />
      <div className="settings-sidebar-items" ref={sidebarRef}>
        {SETTINGS_SIDEBAR_ITEMS.map(
          (section: { items: SidebarItem[] }, index) => (
            <div key={section.items[0].label} className="flex flex-col">
              <SettingsModalSidebarItems
                items={section.items}
                currentPage={currentPage}
                onPageChange={onPageChange}
                divider={index !== SETTINGS_SIDEBAR_ITEMS.length - 1}
                dividerMargin="mx-2"
              />
            </div>
          )
        )}
      </div>
      {/* Active indicator */}
      <SidebarActiveIndicator
        top={activeIndicatorTop}
        height={ACTIVE_INDICATOR_HEIGHT}
      />
    </div>
  )
}

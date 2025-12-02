import React from 'react'

import { SidebarItem } from '@/types/globals'
import SidebarDivider from '@/components/layouts/Sidebar/SidebarItems/SidebarDivider'
import SidebarListItem from '@/components/layouts/Sidebar/SidebarItems/SidebarListItem'
import { cn } from '@/utils/cn'

interface SettingsModalSidebarItemsProps {
  items: SidebarItem[]
  currentPage: string
  onPageChange: (page: string) => void
  divider?: boolean
  dividerMargin?: string
}

export const SettingsModalSidebarItems: React.FC<
  SettingsModalSidebarItemsProps
> = ({ items, currentPage, onPageChange, divider, dividerMargin = 'mx-4' }) => {
  return (
    <>
      <ul className="relative flex h-full flex-col">
        {items?.map((item, index) => {
          const page =
            item.route?.href.split('/').pop() || item.label.toLowerCase()
          const isActive = page === currentPage

          const key = item.route?.href || `${item.label}-${index}`

          return (
            <li
              key={key}
              className={cn('z-1 h-9', !isActive && 'hover:bg-secondary/80')}
            >
              <button
                onClick={() => onPageChange(page)}
                data-page={page}
                className={cn(
                  'group flex h-full w-full shrink-0 items-center gap-x-3 px-4 py-1 text-left',
                  !isActive && 'hover:bg-secondary/80',
                  isActive && 'pointer-events-none'
                )}
              >
                <SidebarListItem
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                  variant="primary"
                />
              </button>
            </li>
          )
        })}
      </ul>
      {divider && <SidebarDivider margin={dividerMargin} />}
    </>
  )
}

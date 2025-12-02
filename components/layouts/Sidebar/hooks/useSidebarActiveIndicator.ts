import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from '@/utils/navigation'
import { type SidebarItem } from '@/types/globals'
import { ROUTES } from '@/routes'

const ACTIVE_INDICATOR_HEIGHT = 36
// Default offset for main sidebar
const DEFAULT_ACTIVE_INDICATOR_OFFSET = 8

export const useSidebarActiveIndicator = (
  sidebarItems: SidebarItem[],
  customOffset?: number
) => {
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [activeIndicatorTop, setActiveIndicatorTop] = useState<number | null>(
    null
  )

  const isItemActive = useCallback(
    (item: SidebarItem) => {
      // Skip items without routes (like onClick-only items)
      if (!item.route) return false

      if (item.route.href === '/') {
        return pathname === '/' || pathname.startsWith(ROUTES.UserEntityConfig)
      }
      return pathname.startsWith(item.route.href)
    },
    [pathname]
  )

  const activeItem = useMemo(() => {
    const routeItems = sidebarItems.filter((item) => item.route)
    return routeItems.find(isItemActive) || null
  }, [sidebarItems, isItemActive])

  useEffect(() => {
    if (!activeItem?.route || !sidebarRef.current) {
      setActiveIndicatorTop(null)
      return
    }

    const activeElement =
      sidebarRef.current.querySelector(`a[href="${activeItem.route.href}"]`) ||
      sidebarRef.current.querySelector(
        `button[data-href="${activeItem.route.href}"]`
      )

    if (activeElement) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()
      setActiveIndicatorTop(
        elementRect.top -
          sidebarRect.top -
          (customOffset ?? DEFAULT_ACTIVE_INDICATOR_OFFSET)
      )
    }
  }, [activeItem, pathname, customOffset])

  return {
    sidebarRef,
    activeIndicatorTop,
    ACTIVE_INDICATOR_HEIGHT
  }
}

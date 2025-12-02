import { useCallback, type FC } from 'react'
import Link from '@/components/ui/Link'
import StatePreservingLink from '@/components/ui/StatePreservingLink'
import { usePathname } from '@/utils/navigation'
import { cn } from '@/utils/cn'
import type { SidebarItemsProps } from '../types'
import { type SidebarItem } from '@/types/globals'
import SidebarListItem from './SidebarListItem'
import { ROUTES } from '@/routes'
import SidebarDivider from './SidebarDivider'

const SidebarItems: FC<SidebarItemsProps> = ({
  items,
  className,
  rightIconType,
  divider,
  dividerMargin = 'mx-4',
  variant = 'primary',
  isSidebarInactive = false
}) => {
  const pathname = usePathname()
  const isSecondary = variant === 'secondary'

  const getIsItemActive = useCallback(
    (item: SidebarItem) => {
      if (isSidebarInactive) return false
      if (!item.route) return false

      if (item.route.href === ROUTES.UserHome) {
        return (
          pathname === ROUTES.UserHome ||
          pathname.startsWith(ROUTES.UserEntityConfig)
        )
      }
      return pathname.startsWith(item.route.href)
    },
    [pathname, isSidebarInactive]
  )

  const getIsExactMatch = useCallback(
    (item: SidebarItem) => {
      if (!item.route) return false
      if (item.route.href === ROUTES.UserHome) {
        return pathname === ROUTES.UserHome
      }
      return pathname.startsWith(item.route.href)
    },
    [pathname]
  )

  const renderItem = (item: SidebarItem) => {
    const isActive = getIsItemActive(item)
    const isExactMatch = getIsExactMatch(item)
    const commonClasses = cn(
      'group flex h-full shrink-0 items-center gap-x-3 px-4 py-1 outline-none focus-visible:ring-primary/50 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:rounded-sm',
      !isActive && 'hover:bg-secondary/80',
      isExactMatch && 'pointer-events-none'
    )

    const content = (
      <SidebarListItem
        icon={item.icon}
        label={item.label}
        isActive={isActive}
        rightIconType={rightIconType}
        variant={variant}
      />
    )

    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className={cn(commonClasses, 'w-full text-left')}
        >
          {content}
        </button>
      )
    }

    if (!item.route) {
      return <div className={commonClasses}>{content}</div>
    }

    // Use StatePreservingLink for internal navigation to preserve state
    if (
      !isSecondary &&
      (item.route.href.startsWith('/') || item.route.href === '#')
    ) {
      return (
        <StatePreservingLink href={item.route.href} className={commonClasses}>
          {content}
        </StatePreservingLink>
      )
    }

    // Use regular Link for external links
    return (
      <Link
        href={item.route.href}
        className={commonClasses}
        target={isSecondary ? '_blank' : undefined}
        rel={isSecondary ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <>
      <ul className={cn('relative flex flex-col', className)}>
        {items?.map((item, index) => {
          const isActive = getIsItemActive(item)
          const key = item.route?.href || `${item.label}-${index}`

          return (
            <li
              key={key}
              className={cn('z-1 h-9', !isActive && 'hover:bg-secondary/80')}
            >
              {renderItem(item)}
            </li>
          )
        })}
      </ul>
      {divider && <SidebarDivider margin={dividerMargin} />}
    </>
  )
}

export default SidebarItems

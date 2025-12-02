import { type FC } from 'react'

import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { SideBarEachItem } from '../types'

export type SidebarListItemProps = SideBarEachItem & {
  isActive?: boolean
  variant?: 'primary' | 'secondary'
}

const SidebarListItem: FC<SidebarListItemProps> = ({
  label,
  icon,
  isActive,
  rightIconType,
  variant = 'primary'
}) => {
  const textColorClass = isActive
    ? 'text-primary'
    : 'text-muted group-hover:text-primary'
  const isSecondary = variant === 'secondary'
  return (
    <div className="flex size-full shrink-0 select-none items-center justify-between">
      <div
        className={cn('flex items-center', isSecondary ? 'gap-x-4' : 'gap-x-2')}
      >
        {icon && (
          <Icon
            type={icon}
            size={isSecondary ? 'xs' : 'xxs'}
            className={textColorClass}
          />
        )}

        <Paragraph
          size={isSecondary ? 'label' : 'body'}
          className={cn(
            'whitespace-nowrap',
            isSecondary && 'uppercase',
            isActive ? 'truncate text-primary' : textColorClass
          )}
        >
          {label}
        </Paragraph>
      </div>

      {rightIconType && (
        <Icon
          type={rightIconType}
          size="xs"
          className={cn('text-primary/100 duration-150', textColorClass)}
        />
      )}
    </div>
  )
}

export default SidebarListItem

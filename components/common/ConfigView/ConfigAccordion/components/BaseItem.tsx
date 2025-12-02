import type { FC, ReactNode } from 'react'
import type { BaseItemProps } from '../../types'
import EmptyBadge from '@/components/common/Playground/RightSidebar/EmptyBadge'

interface Props extends BaseItemProps {
  children: ReactNode
}

export const BaseItem: FC<Props> = ({ empty, children }) =>
  empty ? <EmptyBadge /> : <>{children}</>

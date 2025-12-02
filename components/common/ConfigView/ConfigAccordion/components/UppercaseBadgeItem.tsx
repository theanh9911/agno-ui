import type { FC } from 'react'
import type { BaseItemProps } from '../../types'
import { BaseItem } from './BaseItem'
import { Badge } from '@/components/ui/badge'

export const UppercaseBadgeItem: FC<BaseItemProps> = ({ config, empty }) => (
  <BaseItem config={config} empty={empty}>
    <Badge variant="secondary" className="uppercase">
      {config?.name}
    </Badge>
  </BaseItem>
)

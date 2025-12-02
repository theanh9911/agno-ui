import type { FC } from 'react'
import type { BaseItemProps } from '../../types'
import { BaseItem } from './BaseItem'
import Paragraph from '@/components/ui/typography/Paragraph'

import { TagList } from '@/components/common/TagControls'

export const ConfigWithTagListItem: FC<BaseItemProps> = ({ config, empty }) => {
  return (
    <BaseItem config={config} empty={empty}>
      <div className="flex items-center gap-2">
        <Paragraph size="sm" className="text-primary">
          {config?.name}
        </Paragraph>

        <TagList
          tags={config?.tags ?? []}
          wrapLimit={config?.tags?.length ?? 0}
        />
      </div>
    </BaseItem>
  )
}

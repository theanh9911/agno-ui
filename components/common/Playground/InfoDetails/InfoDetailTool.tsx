import React, { type FC } from 'react'

import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'
import { cn } from '@/utils/cn'

interface InfoDetailToolProps {
  content?: string
  color?: string
}

const InfoDetailTool: FC<InfoDetailToolProps> = ({ content, color }) => (
  <Tooltip
    content={content ?? 'Click the tool to see more info'}
    delayDuration={0}
    side="bottom"
    contentClassName="max-w-xs"
  >
    <Icon type="info" className={cn(color ?? 'text-muted/80')} size="xs" />
  </Tooltip>
)

export default InfoDetailTool

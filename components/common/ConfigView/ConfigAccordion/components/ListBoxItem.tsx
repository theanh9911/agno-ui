import type { FC } from 'react'
import type { BaseItemProps } from '../../types'
import { BaseItem } from './BaseItem'
import type { ListContentItem } from '@/types/config'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import { cn } from '@/utils/cn'

// Single recursive component for rendering list items
const ListItem: FC<{ item: ListContentItem; depth?: number }> = ({
  item,
  depth = 0
}) => {
  if (typeof item === 'string') {
    return <div className="text-muted-foreground py-0.5">{item}</div>
  }

  if (item?.key === 'instructions' && item?.value) {
    return (
      <div className="w-full space-y-1">
        <div className="font-medium text-primary">{item.key}:</div>
        <div className="rounded-md border border-border/50 bg-background/50 p-3">
          <MarkdownRenderer classname="text-xs prose-xs max-w-none overflow-x-auto">
            {item.value}
          </MarkdownRenderer>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', depth > 0 && 'pl-2')}>
      {(item?.key || item?.value) && (
        <div className="flex items-start gap-2 py-0.5">
          {item?.key && (
            <span className="font-medium text-primary">{item.key}:</span>
          )}
          {item?.value && (
            <span className="text-muted-foreground">{item.value}</span>
          )}
        </div>
      )}
      {item?.children && (
        <div className="space-y-1 border-l border-border pl-2">
          {item?.children?.map((child, idx) => (
            <ListItem key={idx} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export const ListBoxItem: FC<BaseItemProps> = ({ config, empty }) => (
  <BaseItem config={config} empty={empty}>
    <div className="flex w-full flex-col gap-3 rounded-[10px] bg-secondary/50 p-3 font-dmmono text-xs">
      {config?.lists?.map((items, index) => (
        <div key={`${items?.id}-${index}`} className="space-y-2">
          {items?.heading && (
            <div className="font-semibold text-primary">{items.heading}</div>
          )}
          <div className="space-y-1.5">
            {items?.content?.map((item, idx) => (
              <ListItem key={idx} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </BaseItem>
)

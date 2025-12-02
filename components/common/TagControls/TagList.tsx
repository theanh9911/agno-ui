import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { FC } from 'react'

type TagListProps = {
  tags: Array<string>
  wrapLimit?: number
  removable?: boolean
  onClick?: (tag: string) => void
}
const TagList: FC<TagListProps> = ({
  tags,
  wrapLimit = 2,
  removable,
  onClick
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, wrapLimit).map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="outline"
          className={cn('uppercase', removable && 'cursor-pointer')}
          onClick={() => removable && onClick?.(tag)}
          icon={removable ? 'close' : undefined}
          iconPosition={removable ? 'right' : undefined}
        >
          {tag}
        </Badge>
      ))}
      {tags.length > wrapLimit && (
        <Badge variant="outline" className="uppercase">
          +{tags.length - wrapLimit}
        </Badge>
      )}
    </div>
  )
}

export default TagList

import { memo } from 'react'
import Icon from '@/components/ui/icon/Icon'

const StreamingLoader = memo(() => {
  return (
    <Icon
      type="working-loader"
      size="xs"
      className="animate-spin text-muted opacity-100"
    />
  )
})

StreamingLoader.displayName = 'StreamingLoader'

export default StreamingLoader

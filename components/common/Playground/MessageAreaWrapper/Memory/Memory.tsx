import { useSheet } from '@/providers/SheetProvider'
import { useRef } from 'react'
import { MemorySheet } from './MemorySheet'
import { useUser } from '@/api/hooks/queries'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/common/Tooltip/Tooltip'

export const Memory = () => {
  const { openSheet } = useSheet()
  const { data: user } = useUser()
  const userId = user?.user.username ?? ''
  const sheetIdRef = useRef<string>(userId)

  const handleMemoryClick = () => {
    const id = openSheet(() => <MemorySheet userId={userId} />, {
      side: 'right',
      title: 'Memory'
    })
    sheetIdRef.current = id
  }

  return (
    <Tooltip content="Memory" delayDuration={0} side="top" asChild>
      <Button
        variant="secondary"
        icon="memory-stick"
        className="h-6 w-8 shrink-0 uppercase"
        onClick={handleMemoryClick}
        size="iconSm"
      />
    </Tooltip>
  )
}

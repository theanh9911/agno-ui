import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import CopyButton from '@/components/common/CopyButton'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Memory } from '@/types/memory'
import Icon from '@/components/ui/icon'
import { IconType } from '@/components/ui/icon'
import { formatDate } from '@/utils/format'
import { useDialog } from '@/providers/DialogProvider/DialogProvider'

interface MemoryDetailsContentProps {
  memory: Memory
}

// Reusable section header component
const SectionHeader = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex items-center gap-2">
    <Icon type={icon as IconType} size="xs" color="muted" />
    <Paragraph size="xsmall" className="text-muted">
      {label}
    </Paragraph>
  </div>
)

export function MemoryDetailsContent({ memory }: MemoryDetailsContentProps) {
  const { closeDialog } = useDialog()
  return (
    <DialogContent
      className="max-w-2xl"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader className="flex flex-row justify-between gap-y-2 pr-1">
        <DialogTitle>Memory Details</DialogTitle>
        <Button
          variant="icon"
          onClick={closeDialog}
          icon="close"
          size="xs"
          aria-label="Close dialog"
        />
      </DialogHeader>
      <div className="space-y-6">
        <div className="space-y-2">
          <SectionHeader icon="align-left" label="Content" />
          <div className="relative rounded-lg bg-secondary/50">
            <div className="absolute right-2 top-2 z-10">
              <CopyButton content={memory.memory} />
            </div>
            <div className="hide-scrollbar max-h-20 overflow-y-auto pr-10">
              <Paragraph size="body" className="break-words p-3">
                {memory.memory}
              </Paragraph>
            </div>
          </div>
        </div>

        {memory.topics && memory.topics.length > 0 && (
          <div className="space-y-2">
            <SectionHeader icon="tags" label="Topics" />
            <div className="relative overflow-hidden rounded-lg bg-secondary/50 p-3">
              <div className="hide-scrollbar max-h-24 overflow-y-auto pr-8">
                <div className="flex flex-wrap gap-2">
                  {memory.topics?.map((topic, index) => (
                    <Badge key={index} variant="outline" className="uppercase">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="absolute right-2 top-2">
                <CopyButton content={memory.topics?.join(',') || ''} />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <SectionHeader icon="calendar" label="Updated at" />
          <div className="relative rounded-lg bg-secondary/50 p-3">
            <Paragraph size="body" className="font-dmmono">
              {formatDate(memory?.updated_at, 'date-with-24h-time')}
            </Paragraph>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

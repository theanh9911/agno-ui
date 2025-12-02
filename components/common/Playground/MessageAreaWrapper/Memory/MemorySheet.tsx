import Paragraph from '@/components/ui/typography/Paragraph'
import MemoriesTab from '../../RightSidebar/PlaygroundSidebarTabs/MemoriesTab/MemoriesTab'

export const MemorySheet = ({ userId }: { userId: string }) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Paragraph size="label" className="uppercase text-muted">
          User ID
        </Paragraph>
        <div className="rounded-md border border-border bg-secondary px-3 py-2">
          <Paragraph size="body" className="text-primary">
            {userId}
          </Paragraph>
        </div>
      </div>
      <MemoriesTab />
    </div>
  )
}

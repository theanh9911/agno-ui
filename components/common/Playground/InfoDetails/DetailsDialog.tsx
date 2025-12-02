import { type ReactNode } from 'react'

import ToolsContent from '@/components/common/Playground/Tools'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  type ReferencesData,
  type ReferencesDocsData,
  type Message
} from '@/types/Agent'

import ReferencesDialogContent from '../References/ReferencesDialogContent'

interface DetailsDialogProps {
  tools?: Message
  references?: ReferencesData
  referencesDoc?: ReferencesDocsData
  children: ReactNode
  name?: string
  customContent?: ReactNode
}

const DetailsDialog = ({
  tools,
  references,
  referencesDoc,
  children,
  name,
  customContent
}: DetailsDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="max-w-[623px] overflow-auto" showCloseButton>
      {name && (
        <DialogHeader className="mb-6">
          <DialogTitle>
            <Paragraph size="lead" className="uppercase">
              {name}
            </Paragraph>
          </DialogTitle>
        </DialogHeader>
      )}

      {references && referencesDoc?.content && (
        <ReferencesDialogContent doc={referencesDoc} />
      )}
      {tools && <ToolsContent role="tool" tools={tools} hover={false} />}
      {customContent && customContent}
    </DialogContent>
  </Dialog>
)

export default DetailsDialog

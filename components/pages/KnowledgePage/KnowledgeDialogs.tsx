import React, { Suspense } from 'react'
import { KnowledgePageMode } from '@/types/Knowledge'
import {
  ContentReadEditDialog,
  ContentUploadDialog,
  ContentUploaderSelector
} from './Actions'
import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import { useParams } from '@/utils/navigation'

type KnowledgeDialogsProps = {
  onClosePrimary: () => void
}

export default function KnowledgeDialogs({
  onClosePrimary
}: KnowledgeDialogsProps) {
  const { id } = useParams()
  const { ContentDialogMode, selectedDocument, setContentDialogMode } =
    useKnowledgeStore()
  return (
    <>
      <Suspense fallback={null}>
        <ContentUploadDialog
          isOpen={ContentDialogMode === KnowledgePageMode.CREATE}
          onClose={onClosePrimary}
        />
      </Suspense>

      {/* Edit Dialog */}
      <Suspense fallback={null}>
        <ContentReadEditDialog
          isOpen={ContentDialogMode === KnowledgePageMode.EDIT}
          onClose={onClosePrimary}
          documentData={selectedDocument}
          isEditMode={true}
        />
      </Suspense>

      {/* Read Dialog - deep-link open when no dialog active */}
      <Suspense fallback={null}>
        <ContentReadEditDialog
          isOpen={Boolean(
            id && selectedDocument?.id && ContentDialogMode === null
          )}
          onClose={onClosePrimary}
          documentData={selectedDocument}
          isEditMode={false}
        />
      </Suspense>

      {/* Delete dialogs are now handled via openDialog */}

      <Suspense fallback={null}>
        <ContentUploaderSelector
          isOpen={ContentDialogMode === KnowledgePageMode.SELECTOR}
          onClose={() => setContentDialogMode(null)}
        />
      </Suspense>
    </>
  )
}

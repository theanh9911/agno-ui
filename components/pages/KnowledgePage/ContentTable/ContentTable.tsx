import { DataTable } from '@/components/common/DataTable'
import { useKnowledgeStore } from '@/stores/KnowledgeStore'
import useGetDocuments from '@/hooks/knowledge/useGetDocuments'
import { useRouter } from '@/utils/navigation'

import { KnowledgeDocument, DocumentStatusEnums } from '@/types/Knowledge'
import { useColumns } from './columns'

type ContentTableProps = {
  selectedItems?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
  isLoading?: boolean
}

const ContentTable = ({
  selectedItems,
  onSelectionChange,
  isLoading
}: ContentTableProps) => {
  const { setSelectedDocument } = useKnowledgeStore()
  const router = useRouter()
  const columns = useColumns()

  const { data: documents } = useGetDocuments()

  const handleRowClick = (document: KnowledgeDocument) => {
    if (document.status !== DocumentStatusEnums.COMPLETED) {
      return
    }

    const currentSearch = router?.search || window?.location?.search || ''
    router.push(`/knowledge/${document.id}${currentSearch}`)
    setSelectedDocument(document)
  }

  return (
    <DataTable
      columns={columns}
      data={documents?.data || []}
      onRowClick={handleRowClick}
      isRowClickable={(document: KnowledgeDocument) =>
        document.status === DocumentStatusEnums.COMPLETED
      }
      enableRowSelection
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      getItemId={(d: KnowledgeDocument) => d.id}
      isLoading={isLoading}
    />
  )
}

export default ContentTable

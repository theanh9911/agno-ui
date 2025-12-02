import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/utils/cn'
import Paragraph from '@/components/ui/typography/Paragraph/Paragraph'
import { formatDate } from '@/utils/format'
import Icon from '@/components/ui/icon'
import { knowledge } from '@/utils/MockData'
import Pagination from '../../SessionsPage/SessionsList/Pagination/Pagination'
import { SquareCheckbox } from '@/components/ui/square-checkbox'
import { EditDeleteCTAs } from '../Actions'
import { KnowledgeDocument } from '@/types/Knowledge'
import { metadataTags } from '../utils'
import { TagList } from '@/components/common/TagControls'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const getFileTypeDisplay = (type: string | null) => {
  if (!type) return 'URL'
  if (type === 'text/csv') return 'CSV'
  return type.toUpperCase()
}

const getContentIcon = (type: string | null) => {
  if (!type) return 'link'
  if (type === 'text/csv') return 'csv'
  return 'file'
}

const KnowledgeTeaserPage = () => {
  const documents = knowledge.data

  const containerClassName = cn('border-0 border-none', 'pb-2')

  return (
    <TeaserPageWrapper className="z-10 flex size-full flex-col overflow-hidden rounded-lg border border-border">
      <Table className="h-full w-full" containerClassName={containerClassName}>
        <TableHeader className="sticky top-0 z-10 h-12 bg-accent text-xs backdrop-blur-sm">
          <TableRow variant="header">
            <TableHead className="w-[3%] truncate">
              <SquareCheckbox />
            </TableHead>
            <TableHead className="w-[15%] truncate">Name</TableHead>
            <TableHead className="w-[15%] truncate">Content type</TableHead>
            <TableHead className="w-[40%] truncate">Metadata</TableHead>

            <TableHead className="w-[20%] truncate text-right">
              Updated at
            </TableHead>
            <TableHead className="w-[10%] truncate"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody lastRowBorder={false}>
          {documents?.map((document: KnowledgeDocument, index: number) => {
            return (
              <TableRow
                key={document.id + index}
                className="h-[72px] max-w-0 cursor-pointer select-none hover:bg-secondary/50"
              >
                <TableCell>
                  <SquareCheckbox />
                </TableCell>
                <TableCell>
                  <Paragraph size="title" className="truncate text-primary">
                    {document.name}
                  </Paragraph>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon
                      type={getContentIcon(document?.type)}
                      size={20}
                      className="text-brand"
                    />
                    <Paragraph size="xsmall" className="text-primary">
                      {getFileTypeDisplay(document.type)}
                    </Paragraph>
                  </div>
                </TableCell>
                <TableCell>
                  <Paragraph size="xsmall" className="text-primary">
                    <TagList tags={metadataTags(document)} wrapLimit={2} />
                  </Paragraph>
                </TableCell>
                <TableCell>
                  <Paragraph
                    size="title"
                    className="truncate text-right text-muted"
                  >
                    {formatDate(document?.updated_at, 'date-with-24h-time')}
                  </Paragraph>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <EditDeleteCTAs document={document} />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="Pagination-Gradient absolute bottom-0 left-0 z-[9999] flex h-[80px] w-full items-center justify-center">
        <Pagination
          currentPage={knowledge.meta.page}
          onPageChange={() => {}}
          totalPages={knowledge.meta.total_pages}
          pageSize={knowledge.meta.limit}
        />
      </div>
    </TeaserPageWrapper>
  )
}

export default KnowledgeTeaserPage

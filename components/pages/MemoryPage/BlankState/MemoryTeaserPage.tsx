import { Table, TableCell } from '@/components/ui/table'
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Paragraph from '@/components/ui/typography/Paragraph'
import React from 'react'
import { ActionButtons } from '../Memory/MemoryComponents'
import { SquareCheckbox } from '@/components/ui/square-checkbox'

import { memory } from '../../../../utils/MockData'
import { Memory } from '@/types/memory'
import { TagList } from '@/components/common/TagControls'
import { formatDate } from '@/utils/format'
import Pagination from '../../SessionsPage/SessionsList/Pagination/Pagination'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const MemoryTeaserPage = () => {
  const documents = memory.data

  return (
    <TeaserPageWrapper className="z-10 flex size-full flex-col overflow-hidden rounded-lg border border-border">
      <div className="mb-14">
        <Table className="w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 h-12 bg-accent text-xs backdrop-blur-sm">
            <TableRow variant="header">
              <TableHead className="w-[3%] truncate">
                <SquareCheckbox />
              </TableHead>
              <TableHead className="w-[44%] truncate">Content</TableHead>
              <TableHead className="w-[29%] truncate">Topics</TableHead>
              <TableHead className="w-[12%] truncate text-right">
                Updated at
              </TableHead>
              <TableHead className="w-[12%] truncate"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody lastRowBorder={false}>
            {documents?.map((memory: Memory, index: number) => (
              <TableRow
                key={memory.memory_id + index}
                className="w-full cursor-pointer select-none border-b border-border bg-transparent hover:bg-secondary/50"
              >
                <TableCell>
                  <SquareCheckbox />
                </TableCell>
                <TableCell>
                  <Paragraph size="title" className="truncate text-primary">
                    {memory.memory}
                  </Paragraph>
                </TableCell>

                <TableCell className="truncate text-xs">
                  <TagList tags={memory?.topics} wrapLimit={1} />
                </TableCell>
                <TableCell>
                  <Paragraph
                    size="title"
                    className="truncate text-right text-muted"
                  >
                    {formatDate(memory?.updated_at, 'date-with-24h-time')}
                  </Paragraph>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <ActionButtons
                      memory={memory}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="Pagination-Gradient absolute bottom-0 left-0 z-[9999] flex h-[80px] w-full items-center justify-center">
        <Pagination
          currentPage={memory.meta.page}
          onPageChange={() => {}}
          totalPages={memory.meta.total_pages}
          pageSize={memory.meta.limit}
        />
      </div>
    </TeaserPageWrapper>
  )
}

export default MemoryTeaserPage

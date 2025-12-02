'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
  PaginationState
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { useRowSelection } from './useRowSelection'
import {
  DataTableHeaderCheckbox,
  DataTableRowCheckbox
} from './DataTableHelpers'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { AnimatePresence, motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

// Extend ColumnMeta to include className
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-constraint */
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-constraint */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  // Row selection - can be managed externally or internally
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean
  // OR use built-in selection management
  selectedItems?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
  getItemId?: (item: TData) => string
  // Pagination
  // Pagination mode is added for backwards compatibility with how we're currently handling pagination.
  // We should streamline this in the future by having a centralised pagination store/state so that we can manage pagination in one place.
  paginationMode?: 'internal' | 'external'
  enablePagination?: boolean
  pageIndex?: number
  pageSize?: number
  onPageIndexChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
  totalRows?: number
  // Styling
  containerClassName?: string
  headerClassName?: string
  // Row behavior
  isRowClickable?: (row: TData) => boolean
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
  selectedItems,
  onSelectionChange,
  getItemId,
  paginationMode = 'external',
  enablePagination = false,
  pageIndex = 0,
  pageSize = 25,
  onPageIndexChange,
  onPageSizeChange,
  totalRows,
  containerClassName,
  headerClassName,
  isRowClickable,
  isLoading
}: DataTableProps<TData, TValue>) {
  // Use built-in row selection if props are provided, otherwise use external selection
  const builtInSelection =
    selectedItems && onSelectionChange && getItemId
      ? useRowSelection({
          data,
          selectedItems,
          onSelectionChange,
          getItemId
        })
      : null

  // Internal fallback selection state when not controlled or using built-in mapping
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({})

  // Use built-in selection if available, otherwise use external props, otherwise internal state
  const finalRowSelection =
    builtInSelection?.rowSelection ?? rowSelection ?? internalRowSelection
  const finalOnRowSelectionChange =
    builtInSelection?.onRowSelectionChange ??
    onRowSelectionChange ??
    setInternalRowSelection
  const finalEnableRowSelection = enableRowSelection || !!builtInSelection

  // Pagination state management
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex,
      pageSize
    }
  )

  const finalPagination: PaginationState =
    paginationMode === 'internal' ? internalPagination : { pageIndex, pageSize }

  const handlePaginationChange = (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => {
    if (paginationMode === 'internal') {
      setInternalPagination(updater)
    } else {
      // For external pagination, extract the values and call the handlers
      const newPagination =
        typeof updater === 'function' ? updater(finalPagination) : updater

      if (newPagination.pageIndex !== pageIndex) {
        onPageIndexChange?.(newPagination.pageIndex)
      }
      if (newPagination.pageSize !== pageSize) {
        onPageSizeChange?.(newPagination.pageSize)
      }
    }
  }

  // Inject selection column when selection is enabled
  const finalColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!finalEnableRowSelection) return columns

    const selectColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <DataTableHeaderCheckbox
            checked={
              table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={(checked) =>
              table.toggleAllRowsSelected(!!checked)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DataTableRowCheckbox
            rowId={row.id}
            isSelected={row.getIsSelected()}
            onSelectRow={(_, checked) => row.toggleSelected(!!checked)}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: 'w-[3%] max-w-[30px] text-center' }
    }

    return [selectColumn, ...columns]
  }, [columns, finalEnableRowSelection])

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination: paginationMode === 'external',
      ...(paginationMode === 'external' && totalRows && { rowCount: totalRows })
    }),
    state: {
      rowSelection: finalRowSelection,
      ...(enablePagination && { pagination: finalPagination })
    },
    onRowSelectionChange: finalOnRowSelectionChange,
    enableRowSelection: finalEnableRowSelection,
    ...(enablePagination && { onPaginationChange: handlePaginationChange }),
    // Use stable row ids to ensure correct AnimatePresence exit animations
    getRowId: getItemId
      ? (originalRow: TData) => getItemId(originalRow)
      : undefined
  })

  return (
    <Table
      className="h-full w-full table-fixed"
      containerClassName={`border-0 border-none h-full flex-1 min-h-0 overflow-auto ${containerClassName || ''}`}
    >
      <TableHeader
        className={`sticky top-0 z-10 h-12 bg-accent text-xs backdrop-blur-sm ${headerClassName || ''}`}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} variant="header">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody lastRowBorder={false}>
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="border-none">
                {finalColumns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.meta?.className}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : table.getRowModel().rows?.length ? (
          <AnimatePresence mode="popLayout">
            {table.getRowModel().rows.map((row, index) => {
              const clickable =
                Boolean(onRowClick) &&
                (isRowClickable ? isRowClickable(row.original) : true)
              return (
                <motion.tr
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.03,
                    ease: [0.25, 0.25, 0, 1],
                    layout: { duration: 0.25, ease: [0.25, 0.25, 0, 1] }
                  }}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    if (!onRowClick) return
                    if (clickable) onRowClick(row.original)
                  }}
                  className={`h-[72px] w-full select-none border-b border-border ${clickable ? 'cursor-pointer hover:bg-secondary/50' : 'hover:bg-transparent'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                      onClick={(e) => {
                        // Stop propagation for selection column so row click doesn't toggle
                        if (cell.column.id === 'select') {
                          e.stopPropagation()
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              )
            })}
          </AnimatePresence>
        ) : (
          <TableRow>
            <TableCell
              colSpan={finalColumns.length}
              className="h-24 text-center"
            ></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/utils/cn'
import { HeaderCheckbox } from '../EvaluationControl/EvaluationComponents'
import EvaluationRow from '../EvaluationControl/EvaluationRow'
import { EvalRunData } from '@/types/evals'
import { useEvaluation } from '../hooks/useEvaluation'

// Delete operations are passed from the parent component since the delete modal state is managed there
// and we need to communicate delete click events back to the parent so that the delete modal can be opened
interface EvaluationTableProps {
  deleteOperations: {
    handleDeleteEvaluation: (id: string, e: React.MouseEvent) => void
    deleteEvalsMutation: { isPending: boolean }
  }
}

const EvaluationTable = ({ deleteOperations }: EvaluationTableProps) => {
  const {
    evals,
    selectedEvaluations,
    totalPages,
    Selection,
    editOperations,
    handleEvaluationClick,
    activeEvaluation,
    pendingEvaluations
  } = useEvaluation()

  return (
    <Table
      className="w-full table-fixed"
      containerClassName={cn(
        'border-0 border-none',
        totalPages && totalPages > 1 && selectedEvaluations.size > 0
          ? 'pb-32'
          : totalPages && totalPages > 1
            ? 'pb-24'
            : selectedEvaluations.size > 0
              ? 'pb-14'
              : editOperations.editingEvaluationId
                ? 'pb-16'
                : 'pb-2'
      )}
    >
      <TableHeader className="Header-Gradient bg-background bg-transparent text-xs backdrop-blur-sm">
        <TableRow variant="header" className="border-0 border-none">
          <TableHead className="w-[24%] truncate">
            <div className="flex items-center gap-2">
              <HeaderCheckbox
                isAllSelected={Selection.isAllSelected}
                isIndeterminate={Selection.isIndeterminate}
                handleSelectAll={Selection.handleSelectAll}
              />
              Eval Name
            </div>
          </TableHead>
          <TableHead className="w-[18%] truncate">ID</TableHead>
          <TableHead className="w-[14%] truncate">Model</TableHead>
          <TableHead className="w-[20%] truncate pr-4 text-right">
            Updated At
          </TableHead>
          <TableHead className="w-[24%] truncate">Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingEvaluations.map((pendingEvaluation, index) => (
          <React.Fragment key={pendingEvaluation.id}>
            <EvaluationRow
              evaluation={pendingEvaluation}
              variant="pending"
              selectedEvaluations={selectedEvaluations}
              Selection={Selection}
            />
            {(index < pendingEvaluations.length - 1 ||
              (evals?.length || 0) > 0) && (
              <TableRow className="h-1 border-none bg-transparent" />
            )}
          </React.Fragment>
        ))}
        {evals?.map((evaluation: EvalRunData, index: number) => (
          <React.Fragment key={evaluation.id}>
            <EvaluationRow
              evaluation={evaluation}
              variant="completed"
              selectedEvaluations={selectedEvaluations}
              Selection={Selection}
              activeEvaluation={activeEvaluation}
              onEvaluationClick={handleEvaluationClick}
              editOperations={editOperations}
              deleteOperations={deleteOperations}
            />
            {index < evals.length - 1 && (
              <TableRow className="h-1 border-none bg-transparent" />
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

export default EvaluationTable

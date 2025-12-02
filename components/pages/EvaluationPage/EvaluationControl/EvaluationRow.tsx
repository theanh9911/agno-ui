import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import Icon from '@/components/ui/icon'
import { formatDate } from '@/utils/format'
import { getProviderIcon } from '@/utils/modelProvider'
import { cn } from '@/utils/cn'
import {
  RowCheckbox,
  DeleteButton,
  EditButton,
  EditRow
} from './EvaluationComponents'
import { EvalRunData } from '@/types/evals'
import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/providers/DialogProvider'
import CreateEvalRunModal from '../CreateEvalRunModal'

interface PendingEvaluation {
  id: string
  eval_name?: string
  entity_id: string
  model?: string
  updated_at: string
  type: string
}

interface EvaluationRowProps {
  evaluation: EvalRunData | PendingEvaluation
  variant: 'pending' | 'completed'
  selectedEvaluations: Set<string>
  Selection: {
    handleSelectRow: (id: string) => void
  }
  activeEvaluation?: { id: string } | null
  onEvaluationClick?: (id: string) => void
  editOperations?: {
    editingEvaluationId: string | null
    handleEditEvaluation: (id: string, e: React.MouseEvent) => void
    handleCancelEdit: () => void
    handleSaveEvaluation: (id: string, newName: string) => void
  }
  deleteOperations?: {
    handleDeleteEvaluation: (id: string, e: React.MouseEvent) => void
    deleteEvalsMutation: { isPending: boolean }
  }
}

const EvaluationRow = ({
  evaluation,
  variant,
  selectedEvaluations,
  Selection,
  activeEvaluation,
  onEvaluationClick,
  editOperations,
  deleteOperations
}: EvaluationRowProps) => {
  const { openDialog } = useDialog()
  const isPending = variant === 'pending'
  const isCompleted = variant === 'completed'

  // Type-safe getters for different evaluation types
  const getName = () => {
    if (isPending) {
      return (evaluation as PendingEvaluation).eval_name || '-'
    }
    return (evaluation as EvalRunData).name || '-'
  }

  const getId = () => {
    if (isPending) {
      return (evaluation as PendingEvaluation).entity_id
    }
    const completedEval = evaluation as EvalRunData
    return (
      completedEval.evaluated_entity_name ??
      completedEval.agent_id ??
      completedEval.id
    )
  }

  const getModel = () => {
    if (isPending) {
      return (evaluation as PendingEvaluation).model || '-'
    }
    return (evaluation as EvalRunData).model_id || '-'
  }

  const getModelProvider = () => {
    if (isPending) {
      return (evaluation as PendingEvaluation).model
    }
    return (evaluation as EvalRunData).model_provider
  }

  const getType = () => {
    if (isPending) {
      return (evaluation as PendingEvaluation).type
    }
    return (evaluation as EvalRunData).eval_type
  }

  const handleRowClick = () => {
    if (isCompleted && onEvaluationClick) {
      onEvaluationClick(evaluation.id)
    }
  }

  return (
    <>
      <TableRow
        data-state={
          isCompleted && activeEvaluation?.id === evaluation.id
            ? 'selected'
            : undefined
        }
        onClick={handleRowClick}
        className={cn(
          'group mb-2 h-[44px] max-w-0 select-none border-none pb-1 text-xs',
          isPending
            ? 'cursor-default opacity-60'
            : 'cursor-pointer hover:bg-secondary/50'
        )}
      >
        <TableCell className="w-[32%] rounded-l-sm py-0 pl-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0">
              <RowCheckbox
                evaluationId={evaluation.id}
                selectedEvaluations={selectedEvaluations}
                handleSelectRow={Selection.handleSelectRow}
                disabled={isPending}
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate">{getName()}</span>
            </div>
          </div>
        </TableCell>

        <TableCell className="max-w-0 truncate py-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="truncate">{getId()}</span>
          </div>
        </TableCell>

        <TableCell className="truncate py-0">
          <div className="flex h-full items-center gap-x-2">
            {getModelProvider() && (
              <Icon
                type={getProviderIcon(getModelProvider()!)}
                className="shrink-0"
                size={20}
              />
            )}
            <span className="truncate">{getModel()}</span>
          </div>
        </TableCell>

        <TableCell className="truncate py-0 pr-4 text-right text-muted">
          {formatDate(evaluation.updated_at, 'date-with-24h-time')}
        </TableCell>

        <TableCell className="truncate rounded-r-sm py-0 pr-4 capitalize">
          <div className="flex items-center justify-between">
            <span className="truncate">{getType()}</span>
            <div className="flex flex-shrink-0 items-center gap-1">
              {isPending && <Spinner />}
              {isCompleted && editOperations && deleteOperations && (
                <div className="hidden flex-shrink-0 items-center gap-1 group-hover:flex">
                  <EditButton
                    evaluationId={evaluation.id}
                    editingEvaluationId={editOperations.editingEvaluationId}
                    handleEditEvaluation={editOperations.handleEditEvaluation}
                    handleCancelEdit={editOperations.handleCancelEdit}
                  />

                  <Button
                    icon="copy-plus"
                    size="iconSmall"
                    variant="ghost"
                    className="border border-border opacity-0 transition-opacity group-hover:bg-transparent group-hover:opacity-100"
                    disabled={deleteOperations.deleteEvalsMutation.isPending}
                    onClick={() => {
                      openDialog(
                        <CreateEvalRunModal
                          preFilledData={evaluation as EvalRunData}
                        />
                      )
                    }}
                  />

                  <DeleteButton
                    evaluationId={evaluation.id}
                    handleDeleteEvaluation={
                      deleteOperations.handleDeleteEvaluation
                    }
                    deleteEvalsMutation={deleteOperations.deleteEvalsMutation}
                  />
                </div>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>

      {isCompleted && editOperations && (
        <EditRow
          evaluationId={evaluation.id}
          editingEvaluationId={editOperations.editingEvaluationId}
          handleSaveEvaluation={editOperations.handleSaveEvaluation}
          handleCancelEdit={editOperations.handleCancelEdit}
        />
      )}
    </>
  )
}

export default EvaluationRow

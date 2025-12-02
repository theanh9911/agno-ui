import { EvalRunData, PerformanceData } from '@/types/evals'
import React from 'react'
import { PerformanceEval } from '../EvaluationData/Evaluation'
import { evalsData } from '../../../../utils/MockData'
import Pagination from '../../SessionsPage/SessionsList/Pagination/Pagination'
import EvaluationRow from '../EvaluationControl/EvaluationRow'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { HeaderCheckbox } from '../../KnowledgePage/Actions/EditDeleteCTAs'
import { evalsList } from '../../../../utils/MockData'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const EvaluationTeaserPage = () => {
  return (
    <TeaserPageWrapper className="flex size-full gap-2 overflow-y-auto px-2">
      <div className="relative flex h-full w-[45%] select-none flex-col overflow-hidden">
        <div className="flex h-full flex-col gap-1">
          <Table className="w-full table-fixed border-0 border-none pb-2">
            <TableHeader className="Header-Gradient bg-background bg-transparent text-xs backdrop-blur-sm">
              <TableRow variant="header" className="border-0 border-none">
                <TableHead className="w-[32%] truncate">
                  <div className="flex items-center gap-2">
                    <HeaderCheckbox
                      isAllSelected={false}
                      isIndeterminate={false}
                      handleSelectAll={() => {}}
                    />
                    Eval Name
                  </div>
                </TableHead>
                <TableHead className="w-[22%] truncate">ID</TableHead>
                <TableHead className="w-[18%] truncate">Model</TableHead>
                <TableHead className="w-[30%] truncate pr-4 text-right">
                  Updated At
                </TableHead>
                <TableHead className="w-[30%] truncate">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evalsList
                ?.map(
                  (evaluation) =>
                    ({
                      ...evaluation,
                      evaluated_entity_name:
                        evaluation.evaluated_component_name,
                      user_id: 'mock-user-id'
                    }) as EvalRunData
                )
                ?.map((evaluation: EvalRunData, index: number) => (
                  <React.Fragment key={evaluation.id}>
                    <EvaluationRow
                      evaluation={evaluation}
                      variant="completed"
                      selectedEvaluations={new Set()}
                      Selection={{ handleSelectRow: () => {} }}
                      activeEvaluation={null}
                      onEvaluationClick={() => {}}
                      editOperations={undefined}
                      deleteOperations={undefined}
                    />
                    {index < evalsList.length - 1 && (
                      <TableRow className="h-1 border-none bg-transparent" />
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="Pagination-Gradient pointer-events-none absolute bottom-0 left-0 z-[9999] flex h-[80px] w-full items-center justify-center backdrop-blur-sm">
          <Pagination
            currentPage={1}
            onPageChange={() => {}}
            totalPages={1}
            pageSize={10}
          />
        </div>
      </div>
      <div className="mb-2 flex w-[55%] flex-col gap-4 overflow-hidden rounded-md border border-border bg-secondary/50">
        <div className="w-full overflow-y-auto p-6">
          <PerformanceEval performance={evalsData as PerformanceData} />
        </div>
      </div>
    </TeaserPageWrapper>
  )
}

export default EvaluationTeaserPage

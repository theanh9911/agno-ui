import React from 'react'
import { PerformanceData } from '@/types/evals'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { summaryMetrics } from '../../constant'
import Tooltip from '@/components/common/Tooltip'
import { formatSmallerTime } from '@/utils/format'

interface IndividualRunsTableProps {
  runs: PerformanceData['runs']
}

export const IndividualRunsTable = ({ runs }: IndividualRunsTableProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <span className="text-sm font-medium">Individual runs</span>
      <Table containerClassName="rounded-md">
        <TableHeader className="bg-accent">
          <TableRow className="h-10">
            <TableHead className="w-[33%] border-r border-border">
              Run
            </TableHead>
            <TableHead className="w-[33%] border-r border-border text-right">
              Time
            </TableHead>
            <TableHead className="w-[34%] text-right">Memory (MiB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(runs) && runs.length > 0 ? (
            runs.map((run, index) => {
              const displayTime =
                typeof run.runtime === 'number'
                  ? formatSmallerTime(run.runtime)
                  : { value: 'N/A', unit: '', originalValue: 'N/A' }
              const displayMemory =
                typeof run.memory === 'number' ? run.memory.toFixed(7) : 'N/A'

              return (
                <TableRow className="h-12" key={`run-${index + 1}`}>
                  <TableCell className="border-r border-border font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-r border-border text-right">
                    <Tooltip content={displayTime.originalValue}>
                      <span>
                        {displayTime.value}
                        {displayTime.unit}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">{displayMemory}</TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow className="h-12">
              <TableCell
                colSpan={3}
                className="text-muted-foreground text-center"
              >
                No individual run data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface PerformanceSummaryTableProps {
  result: PerformanceData['result']
}

export const PerformanceSummaryTable = ({
  result
}: PerformanceSummaryTableProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <span className="text-sm font-medium">Performance Summary</span>
      <Table containerClassName="rounded-md">
        <TableHeader className="bg-accent">
          <TableRow className="h-10">
            <TableHead className="border-r border-border">Metric</TableHead>
            <TableHead className="border-r border-border text-right">
              Time
            </TableHead>
            <TableHead className="text-right">Memory (MiB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(summaryMetrics) &&
            summaryMetrics.map(({ metric, timeKey, memoryKey }) => {
              const timeValue =
                result?.[timeKey as keyof PerformanceData['result']]
              const memoryValue =
                result?.[memoryKey as keyof PerformanceData['result']]
              const displayTimeValue =
                typeof timeValue === 'number'
                  ? formatSmallerTime(timeValue)
                  : { value: 'N/A', unit: '', originalValue: 'N/A' }
              const displayMemoryValue =
                typeof memoryValue === 'number' ? memoryValue.toFixed(7) : 'N/A'
              return (
                <TableRow className="h-12" key={metric}>
                  <TableCell className="border-r border-border font-medium">
                    {metric}
                  </TableCell>
                  <TableCell className="border-r border-border text-right">
                    <Tooltip content={displayTimeValue.originalValue}>
                      <span>
                        {displayTimeValue.value}
                        {displayTimeValue.unit}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    {displayMemoryValue}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}

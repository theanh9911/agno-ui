import React from 'react'
import { ReliabilityData } from '@/types/evals'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

/**
 * Renders the reliability evaluation data.
 * @param reliability - The reliability data.
 * @returns The ReliabilityEval component.
 */
const ReliabilityEval = ({ reliability }: { reliability: ReliabilityData }) => {
  return (
    <Table containerClassName="rounded-md">
      <TableHeader className="bg-accent">
        <TableRow className="h-10">
          <TableHead className="border-r border-border">
            Evaluation Status
          </TableHead>
          <TableHead className="border-r border-border">
            Failed Tool Calls
          </TableHead>
          <TableHead>Passed Tool Calls</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="h-12">
          <TableCell className="border-r border-border">
            {reliability?.eval_status}
          </TableCell>
          <TableCell className="border-r border-border">
            {reliability?.failed_tool_calls?.length > 0
              ? reliability?.failed_tool_calls?.join(', ')
              : 'None'}
          </TableCell>
          <TableCell>
            {reliability?.passed_tool_calls?.length > 0
              ? reliability?.passed_tool_calls?.join(', ')
              : 'None'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default ReliabilityEval

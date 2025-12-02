import React from 'react'
import { PerformanceData } from '@/types/evals'
import {
  IndividualRunsTable,
  PerformanceSummaryTable
} from './PerformanceTables'

/**
 * Renders the performance evaluation data, including individual runs and summary metrics.
 * @param performance - The performance data.
 * @returns The PerformanceEval component.
 */
const PerformanceEval = ({ performance }: { performance: PerformanceData }) => {
  return (
    <div className="space-y-8">
      {performance?.result && (
        <PerformanceSummaryTable result={performance?.result} />
      )}
      {performance?.runs && <IndividualRunsTable runs={performance?.runs} />}
    </div>
  )
}

export default PerformanceEval

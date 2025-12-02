import { RunResponseContent } from '@/types/Agent'
import { StepResult, StepExecutorRun } from '@/types/workflow'

export interface Run extends RunResponseContent {
  children?: Run[]
  step_results?: StepResult[]
  step_executor_runs?: StepExecutorRun[]
}

export function buildRunTree(flatRuns: RunResponseContent[]): Run[] {
  const runMap = new Map<string, Run>()
  const roots: Run[] = []

  // Step 1: Clone and prepare map entries
  for (const run of flatRuns) {
    const runClone: Run = { ...run, children: [] }
    runMap.set(run.run_id, runClone)
  }

  // Step 2: Build hierarchy
  for (const run of runMap.values()) {
    // Check if parent_run_id exists and is not empty string
    if (run.parent_run_id && run.parent_run_id.trim() !== '') {
      const parent = runMap.get(run.parent_run_id)
      if (parent) {
        parent.children!.push(run)
      } else {
        // Parent not found, treat as root
        roots.push(run)
      }
    } else {
      // No parent or empty parent_run_id, this is a root
      roots.push(run)
    }
  }

  return roots
}

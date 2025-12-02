import React from 'react'
import { AccuracyData, PerformanceData, ReliabilityData } from '@/types/evals'
import { AccuracyEval, PerformanceEval, ReliabilityEval } from './Evaluation'
import { useEvaluationStore } from '@/stores/EvaluationStore'
import Icon from '@/components/ui/icon'
import { getProviderIcon } from '@/utils/modelProvider'
import { useMemo } from 'react'
import Tooltip from '@/components/common/Tooltip'
import { EvalRunType } from '@/types/evals'
import { getInitials } from '@/utils/user'
import { useEvaluation } from '../hooks/useEvaluation'
import SkeletonList from '@/components/common/Playground/SkeletonList'

const EvaluationData = () => {
  const { activeEvaluation, pendingEvaluations } = useEvaluationStore()
  const { evals } = useEvaluation()

  const evaluationComponentsMap = useMemo(
    () => ({
      [EvalRunType.Accuracy]: (
        <AccuracyEval accuracy={activeEvaluation?.eval_data as AccuracyData} />
      ),
      [EvalRunType.Performance]: (
        <PerformanceEval
          performance={activeEvaluation?.eval_data as PerformanceData}
        />
      ),
      [EvalRunType.Reliability]: (
        <ReliabilityEval
          reliability={activeEvaluation?.eval_data as ReliabilityData}
        />
      )
    }),
    [activeEvaluation]
  )

  if (pendingEvaluations.length > 0 && evals?.length === 0) {
    return (
      <>
        <SkeletonList skeletonCount={8} />
      </>
    )
  }

  if (!activeEvaluation) {
    return null
  }

  const renderEvaluationHeader = () => {
    const entityName = activeEvaluation.evaluated_entity_name
      ?.split('_')
      .map((word: string, index: number) => {
        const capitalizedWord =
          index === 0 ? getInitials(word) + word.slice(1) : word
        const isLastWord =
          index ===
          (activeEvaluation.evaluated_entity_name?.split('_').length || 0) - 1
        return capitalizedWord + (isLastWord ? '' : ' ')
      })
      .join('')

    return (
      <div className="mb-4 flex flex-wrap items-center gap-x-1 text-lg font-medium">
        {activeEvaluation.evaluated_entity_name ? (
          <>
            <span className="text-muted">
              <span className="capitalize">{activeEvaluation.eval_type}</span>
              {' Evaluation ran on '}
            </span>
            {entityName && <span>{entityName}</span>}
          </>
        ) : activeEvaluation.agent_id ? (
          <>
            <span className="text-muted">
              <span className="capitalize">{activeEvaluation.eval_type}</span>
              {' Evaluation ran on agent with id '}
            </span>
            <Tooltip
              content={activeEvaluation.agent_id}
              side="bottom"
              delayDuration={0}
              className="px-1"
            >
              <span className="block truncate text-primary">
                {activeEvaluation.agent_id.slice(0, 13)}
                {activeEvaluation.agent_id.length > 13 ? '…' : ''}
              </span>
            </Tooltip>
          </>
        ) : (
          <span className="text-muted">
            <span className="capitalize">{activeEvaluation.eval_type}</span>
            {' Evaluation ran with given answers'}
          </span>
        )}
        {activeEvaluation.model_id && <span className="text-muted">using</span>}
        {activeEvaluation.model_id && (
          <div className="flex items-center gap-x-1">
            {activeEvaluation.model_provider && (
              <Icon
                type={getProviderIcon(activeEvaluation.model_provider)}
                size={20}
              />
            )}
            <span className="min-w-0 truncate">
              {activeEvaluation.model_id}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {renderEvaluationHeader()}
      {evaluationComponentsMap[activeEvaluation.eval_type as EvalRunType] ||
        null}
    </>
  )
}

export default EvaluationData

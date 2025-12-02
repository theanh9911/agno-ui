import React from 'react'
import { BlankState, BlankStateWrapper } from '@/components/common/BlankState'
import { useDialog } from '@/providers/DialogProvider'
import CreateEvalRunModal from '../CreateEvalRunModal'
import { DOC_LINKS } from '@/docs'

interface EvaluationBlankStateProps {
  hasEvaluations?: boolean
  hasError?: boolean
}

const EvaluationBlankState = ({
  hasEvaluations = true,
  hasError = false
}: EvaluationBlankStateProps) => {
  const { openDialog } = useDialog()
  // No evaluations or error
  if (!hasEvaluations || hasError) {
    return (
      <BlankStateWrapper>
        <BlankState
          visual="eval-blank-state-icon"
          title="No evaluations run"
          description="Run and inspect evaluations. <br/> Visit our docs for more information."
          docLink={DOC_LINKS.platform.evaluation.introduction}
          buttonText="Run Evaluation"
          buttonIcon="plus"
          buttonOnClick={() => openDialog(<CreateEvalRunModal />)}
        />
      </BlankStateWrapper>
    )
  }

  return (
    <BlankStateWrapper>
      <BlankState
        visual="eval-blank-state-icon"
        title="No databases found"
        description="Please add a database to view evaluations"
      />
    </BlankStateWrapper>
  )
}

export default EvaluationBlankState

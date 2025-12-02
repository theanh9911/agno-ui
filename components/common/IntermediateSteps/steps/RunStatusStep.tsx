import Paragraph from '@/components/ui/typography/Paragraph'
import { IntermediateStep, RunEvent } from '@/types/playground'
import AgentInfo from './AgentInfo'
import { getCancellationReason, getErrorContent } from '../utils'

interface RunStatusStepProps {
  step: IntermediateStep
  isTeam: boolean
}

const RunStatusStep = ({ step, isTeam }: RunStatusStepProps) => {
  let message: string
  switch (true) {
    case step.event.includes(RunEvent.RunStarted):
      message = 'Run Started'
      break
    case step.event.includes(RunEvent.RunCompleted):
      message = 'Run Completed'
      break
    case step.event.includes(RunEvent.RunCancelled):
      message = getCancellationReason(step)
      break
    case step.event.includes(RunEvent.RunError):
      message = getErrorContent(step)
      break
    default:
      message = step.event || ''
  }

  if (!message) return null

  return (
    <AgentInfo step={step} isTeam={isTeam}>
      <Paragraph size="body">{message}</Paragraph>
    </AgentInfo>
  )
}

export default RunStatusStep

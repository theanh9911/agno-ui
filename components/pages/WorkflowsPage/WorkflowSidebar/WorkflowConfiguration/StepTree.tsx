import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { WorkflowStep } from '@/types/workflow'
import { getStepIcon } from '../../../utils'
import Tooltip from '@/components/common/Tooltip'

const EntityDetails = ({
  name
}: {
  name: string
  model?: { provider: string }
}) => {
  return (
    <div className="flex flex-row gap-x-2">
      <Tooltip content={name} asChild>
        <Paragraph size="xsmall" className="truncate">
          {name}
        </Paragraph>
      </Tooltip>
      {/* {model?.provider && (
        <Icon
          type={getProviderIcon(model.provider) as IconType}
          size="xs"
          className="flex shrink-0 rounded-[4px] border-[0.333px] border-border bg-background p-[2.67px]"
        />
      )} */}
    </div>
  )
}

const StepItem = ({
  name,
  agent,
  team,
  type,
  steps,
  depth = 0
}: WorkflowStep & { depth?: number }) => {
  const indentClass = depth > 0 ? 'ml-2' : ''

  return (
    <div className={`${indentClass}`}>
      <div className="flex cursor-pointer flex-row items-center justify-between gap-x-2">
        <div className="flex min-w-0 flex-row gap-x-2">
          <Icon type={getStepIcon(type)} size="xs" className="shrink-0" />
          <Tooltip content={name} asChild>
            <Paragraph size="xsmall" className="truncate">
              {name}
            </Paragraph>
          </Tooltip>
        </div>
        <div className="flex shrink-0">
          {agent && (
            <EntityDetails
              name={agent?.name ?? agent?.id ?? ''}
              model={agent.model}
            />
          )}
          {team && (
            <EntityDetails
              name={team?.name ?? team?.id ?? ''}
              model={team.model}
            />
          )}
        </div>
      </div>
      {steps && steps.length > 0 && (
        <div className={`mt-2 border-l border-border ${indentClass}`}>
          <StepsList steps={steps} depth={depth + 1} />
        </div>
      )}
    </div>
  )
}

const StepsList = ({
  steps,
  depth = 0
}: {
  steps: WorkflowStep[]
  depth?: number
}) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      {steps.map((step) => (
        <StepItem
          key={step.name}
          name={step.name}
          type={step.type}
          agent={step.agent}
          team={step.team}
          steps={step.steps}
          depth={depth}
        />
      ))}
    </div>
  )
}

export const StepsTree = ({ steps }: { steps: WorkflowStep[] }) => {
  if (!steps) return null

  return <StepsList steps={steps} />
}

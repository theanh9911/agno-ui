import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import AppCard from '@/components/ui/AppCard'
import Paragraph from '@/components/ui/typography/Paragraph'
import DocLink from '@/components/common/OSCreateConnectDialogContent/DocLink'
import TerminalCommand from '@/components/common/TerminalCommand'

import { OSCreateConnectDialogModeType } from '@/types/os'
import { USER_CREATION_STEPS, UserTypeStep } from './constant'

interface OSCreationStepsProps {
  currentMode:
    | OSCreateConnectDialogModeType.OLD_USER
    | OSCreateConnectDialogModeType.NEW_USER
  onBack: () => void
  onNext: () => void
}

const OSCreationSteps = ({
  currentMode,
  onBack,
  onNext
}: OSCreationStepsProps) => {
  const steps = USER_CREATION_STEPS[currentMode]
  const isOldUser = currentMode === OSCreateConnectDialogModeType.OLD_USER

  return (
    <>
      {isOldUser && (
        <Paragraph size="title" className="text-primary/80">
          Create an AgentOS to connect your agents, teams and workflows to the
          AgentOS UI and enable powerful management capabilities.
        </Paragraph>
      )}
      {steps.map((step: UserTypeStep, index: number) => (
        <AppCard
          key={index}
          title={
            <div className="flex w-full justify-between">
              <Paragraph size="label">{step.title}</Paragraph>
              {step.link && <DocLink link={step.link} text={step?.linkText} />}
            </div>
          }
          description={
            step.command
              ? {
                  content: <TerminalCommand command={step.command} />,
                  asChild: true
                }
              : undefined
          }
        />
      ))}

      <DialogFooter>
        <Button className="w-full" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </DialogFooter>
    </>
  )
}

export default OSCreationSteps

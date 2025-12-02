import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogTitle,
  DialogContent
} from '@/components/ui/dialog'
import { PARAGRAPH_SIZES } from '@/components/ui/typography/Paragraph/constants'
import { OSCreateConnectDialogModeType } from '@/types/os'
import { OSResponse } from '@/api/generated'
import OSCreateDialog from './OSCreateDialog'
import OSConnectDialogForm from './forms/OSConnectForm'
import OSCreationSteps from './OSCreationSteps'
import { useDialog } from '@/providers/DialogProvider'
import { useOSStore } from '@/stores/OSStore'

interface Props {
  initialMode?: OSCreateConnectDialogModeType
  editingOS?: OSResponse
}

const OSConnectDialogContent = ({
  initialMode = OSCreateConnectDialogModeType.CONNECT,
  editingOS
}: Props) => {
  const { closeDialog } = useDialog()
  const setOSBeingEdited = useOSStore((state) => state.setOSBeingEdited)

  const [currentMode, setCurrentMode] =
    useState<OSCreateConnectDialogModeType>(initialMode)

  useEffect(() => {
    return () => {
      setOSBeingEdited(null)
    }
  }, [setOSBeingEdited])

  const handleModeChange = (mode: OSCreateConnectDialogModeType) => {
    setCurrentMode(mode)
  }

  const handleBackToSelection = () => {
    setCurrentMode(OSCreateConnectDialogModeType.USER_SELECTION)
  }

  const handleNextStep = () => {
    setCurrentMode(OSCreateConnectDialogModeType.CONNECT)
  }

  const renderDialogContent = () => {
    switch (currentMode) {
      case OSCreateConnectDialogModeType.USER_SELECTION:
        return <OSCreateDialog onModeChange={handleModeChange} />
      case OSCreateConnectDialogModeType.NEW_USER:
      case OSCreateConnectDialogModeType.OLD_USER:
        return (
          <OSCreationSteps
            currentMode={currentMode}
            onBack={handleBackToSelection}
            onNext={handleNextStep}
          />
        )
      case OSCreateConnectDialogModeType.CONNECT:
      case OSCreateConnectDialogModeType.EDIT:
        return (
          <OSConnectDialogForm
            currentMode={currentMode}
            initialMode={initialMode}
            editingOS={editingOS}
          />
        )
      default:
        return <OSCreateDialog onModeChange={handleModeChange} />
    }
  }

  const getDialogTitle = () => {
    switch (currentMode) {
      case OSCreateConnectDialogModeType.EDIT:
        return 'Edit your AgentOS'
      case OSCreateConnectDialogModeType.CONNECT:
        return 'Connect your AgentOS'
      default:
        return 'Create your AgentOS'
    }
  }

  return (
    <DialogContent
      className="flex max-h-full max-w-[608px] flex-col gap-y-4"
      aria-describedby={undefined}
    >
      <DialogHeader className="flex flex-row justify-between gap-y-2 pr-1">
        <div className="flex flex-col justify-between">
          <DialogTitle className={PARAGRAPH_SIZES.title}>
            {getDialogTitle()}
          </DialogTitle>
        </div>
        <Button
          variant="icon"
          onClick={() => closeDialog()}
          icon="close"
          size="xs"
          aria-label="Close dialog"
        />
      </DialogHeader>
      {renderDialogContent()}
    </DialogContent>
  )
}

export default OSConnectDialogContent

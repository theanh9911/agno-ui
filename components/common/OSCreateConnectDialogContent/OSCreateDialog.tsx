import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'
import { OSCreateConnectDialogModeType } from '@/types/os'
import { USER_SELECTION_OPTIONS } from './constant'

interface CreateOSDialogProps {
  onModeChange: (mode: OSCreateConnectDialogModeType) => void
}

const CreateOSDialog = ({ onModeChange }: CreateOSDialogProps) => {
  return (
    <div className="flex gap-4">
      {USER_SELECTION_OPTIONS.map((option) => (
        <div
          key={option.mode}
          className="flex h-[184px] flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-sm border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => onModeChange(option.mode)}
          role="button"
          tabIndex={0}
          aria-label={`${option.title}: ${option.description}`}
        >
          <div className="flex flex-col items-start gap-3 text-left">
            <Icon type={option.icon} size="sm" />
            <Paragraph size="lead" className="text-primary">
              {option.title}
            </Paragraph>
          </div>

          <Paragraph size="xsmall" className="text-muted">
            {option.description}
          </Paragraph>
        </div>
      ))}
    </div>
  )
}

export default CreateOSDialog

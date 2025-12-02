import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner'
import Paragraph from '@/components/ui/typography/Paragraph'

interface Props {
  organizationName: string
}

const OrganizationSwitchingOverlay = ({ organizationName }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner className="mt-0 size-8 stroke-primary" />
      <div className="text-center">
        <Paragraph size="body" className="font-medium text-primary">
          Switching organizations...
        </Paragraph>
        <Paragraph size="xsmall" className="mt-1 text-muted">
          Switching to {organizationName}
        </Paragraph>
      </div>
    </div>
  )
}

export default OrganizationSwitchingOverlay

import Link from '@/components/ui/Link'
import { type IconType } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { DOC_LINKS } from '@/docs'
import { useOSStore } from '@/stores/OSStore'
import { useFetchOSStatus } from '@/hooks/os'
import { motion } from 'framer-motion'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'
import { useWorkflows } from '@/hooks/workflows'

interface DocsButtonProps {
  link?: string
  buttonVariant: 'default' | 'secondary'
  icon: IconType
  text: string
  onclick?: () => void
}
const WorkflowMessage = () => {
  const { currentOS } = useOSStore()
  const selectedEndpoint = currentOS?.endpoint_url ?? null
  const { data: isOsAvailable } = useFetchOSStatus()

  const { data: workflows } = useWorkflows()
  const getMessage = () => {
    if (selectedEndpoint && !isOsAvailable) {
      return {
        title: 'Endpoint is not active',
        description:
          'Please make sure the endpoint is active or visit our docs to get started.'
      }
    }
    if (workflows?.length === 0 && isOsAvailable && selectedEndpoint) {
      return {
        title: 'No workflows found',
        description:
          'Please create a workflow to get started or visit our docs to learn more.'
      }
    }
    return {
      title: 'Please select an endpoint to connect to',
      description: 'Visit our docs for more information '
    }
  }
  const message = getMessage()
  return (
    <div className="flex flex-col items-center gap-y-2 text-center">
      <Paragraph size="lead" className="text-primary">
        {message.title}
      </Paragraph>
      <Paragraph size="body" className="text-muted">
        {message.description}
      </Paragraph>
    </div>
  )
}
export const WorkflowButton = ({
  link,
  buttonVariant,
  icon,
  text,
  onclick
}: DocsButtonProps) =>
  link ? (
    <Link href={link} target="_blank">
      <Button
        type="button"
        variant={buttonVariant}
        icon={icon}
        iconPosition="right"
        onClick={onclick}
      >
        {text}
      </Button>
    </Link>
  ) : (
    <Button
      type="button"
      variant={buttonVariant}
      icon={icon}
      iconPosition="right"
      onClick={onclick}
    >
      {text}
    </Button>
  )
const WorkflowBlankState = () => (
  <div className="flex size-full flex-grow flex-col items-center justify-center gap-6 px-4">
    <div className="flex max-w-[800px] flex-col items-center gap-2">
      <Icon
        type="workflow-blank-state-visual"
        size={90}
        className="text-primary"
      />
      <WorkflowMessage />
    </div>
    <div className="flex max-w-[800px] items-center justify-center gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WorkflowButton
          link={DOC_LINKS.platform.workflows.introduction}
          buttonVariant="default"
          icon="external-link"
          text="docs"
        />
      </motion.div>
    </div>
  </div>
)
export default WorkflowBlankState

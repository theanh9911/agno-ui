import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import Link from '@/components/ui/Link'
import { DOC_LINKS } from '@/docs'
import Icon from '@/components/ui/icon'

const BlankPlaceholder = () => {
  return (
    <div className="bg-gradient-home flex size-full justify-center rounded-t-sm border-x border-t border-border p-4">
      <div className="flex w-[17.5rem] flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <Icon type="monitor" size="sm" className="text-primary" />
          <Paragraph size="lead" className="text-primary">
            No AgentOS connected
          </Paragraph>
          <Paragraph size="body" className="text-muted">
            Get started by connecting your AgentOS.
          </Paragraph>
        </div>
        <Link
          href={DOC_LINKS.agentOS.connectOS}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-none focus-visible:rounded-md focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
        >
          <Button>Learn more in our docs</Button>
        </Link>
      </div>
    </div>
  )
}

export default BlankPlaceholder

import { useTheme } from 'next-themes'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Button } from '@/components/ui/button'

export const WelcomeDialogContent = ({
  onClose,
  inline = false
}: {
  onClose: () => void
  inline?: boolean
}) => {
  const { resolvedTheme } = useTheme()

  const getWelcomeImagePath = () => {
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
    return `/images/beta-welcome-${theme}.svg`
  }

  const body = (
    <div className="flex flex-row gap-2 overflow-hidden p-2">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DialogTitle className="text-lg font-medium leading-[1.2] tracking-[-0.18px]">
          Welcome to AgentOS Beta!
        </DialogTitle>

        <div className="flex-1 overflow-y-auto py-px">
          <Paragraph size="body" className="mb-4 text-muted">
            Thank you for joining our beta program. We're excited to have you
            explore AgentOS and help us improve it.
          </Paragraph>
          <Paragraph size="body" className="mb-4 text-muted">
            Get started with full access - reach out to us for a coupon code to
            get 100% discount during the beta period.
          </Paragraph>
          <Paragraph size="body" className="text-muted">
            Contact us:{' '}
            <a
              href="mailto:ab@agno.com"
              className="font-medium text-brand hover:underline"
            >
              ab@agno.com
            </a>
          </Paragraph>
        </div>

        <div className="flex items-center justify-start">
          <Button size="sm" onClick={onClose} className="h-8 px-4 py-2">
            Get Started
          </Button>
        </div>
      </div>

      <div className="flex h-[305px] w-96 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        <img
          src={getWelcomeImagePath()}
          alt="Welcome to AgentOS Beta - Free AgentOS Pro during beta"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  )

  if (inline) return body
  return (
    <DialogContent className="max-w-[800px] overflow-hidden p-0">
      {body}
    </DialogContent>
  )
}

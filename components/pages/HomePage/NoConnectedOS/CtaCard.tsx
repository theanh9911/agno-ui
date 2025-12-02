import { Button } from '@/components/ui/button'
import Icon, { IconType } from '@/components/ui/icon'
import Link from '@/components/ui/Link'
import { Separator } from '@/components/ui/separator'
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import { CtaCardProps } from '../type'

const CtaCard = ({
  icon,
  title,
  description,
  buttonTitle,
  externalLinkText,
  externalLink,
  onButtonClick
}: CtaCardProps) => {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-xl border border-border">
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="flex gap-4">
          <div className="flex size-9 items-center justify-center rounded-md bg-secondary">
            <Icon type={icon as IconType} size={20} />
          </div>
          <Heading size={3}>{title}</Heading>
        </div>
        <div className="flex h-full flex-col justify-between gap-4">
          <Paragraph size="body" className="text-muted">
            {description}
          </Paragraph>

          <Button variant="secondary" onClick={onButtonClick}>
            {buttonTitle}
          </Button>
        </div>
      </div>
      <Separator />
      <Link
        href={externalLink}
        target="_blank"
        className="outline-none focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
        rel="noopener noreferrer"
      >
        <div className="flex justify-between p-6">
          <Paragraph size="body" className="text-primary">
            {externalLinkText}
          </Paragraph>

          <Button
            variant="ghost"
            icon="arrow-up-right"
            size="iconSmall"
            className="cursor-pointer"
          />
        </div>
      </Link>
    </div>
  )
}

export default CtaCard

import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import Link from '@/components/ui/Link'
import { IconType } from '@/components/ui/icon/types'
import Icon from '@/components/ui/icon'

type BlankStateProps = {
  visual: IconType
  title?: string
  description?: string
  docLink?: string
  buttonText?: string
  buttonOnClick?: () => void
  buttonIcon?: IconType
}
const BlankState = ({
  title,
  visual,
  description,
  docLink,
  buttonText,
  buttonOnClick,
  buttonIcon
}: BlankStateProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-md bg-secondary/50">
      <Icon type={visual} size={90} />
      <div className="flex flex-col items-center justify-center gap-2">
        <Paragraph size="title" className="text-primary">
          {title}
        </Paragraph>
        <Paragraph
          size="body"
          className="whitespace-pre-line text-center text-muted"
        >
          {description?.replace(/<br\/>/g, '\n')}
        </Paragraph>
      </div>
      <div className="flex gap-[10px]">
        {docLink && (
          <Button
            type="button"
            variant="secondary"
            icon="external-link"
            iconPosition="right"
          >
            <Link href={docLink} target="_blank">
              DOCS
            </Link>
          </Button>
        )}

        {buttonText && (
          <Button type="button" icon={buttonIcon} onClick={buttonOnClick}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}
export default BlankState

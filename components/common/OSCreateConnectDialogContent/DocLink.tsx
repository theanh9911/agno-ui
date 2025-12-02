import Icon from '@/components/ui/icon/Icon'
import Link from '@/components/ui/Link'
import Paragraph from '@/components/ui/typography/Paragraph'

interface DocLinkProps {
  link: string
  text?: string
}

const DocLink = ({ link, text }: DocLinkProps) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex cursor-pointer items-center gap-x-2 hover:underline hover:underline-offset-2"
    >
      <Paragraph size="label" className="uppercase text-primary">
        {text ?? 'LEARN MORE ON DOCS'}
      </Paragraph>
      <Icon
        type="arrow-up-right"
        size="xs"
        className="flex-shrink-0 text-primary"
      />
    </Link>
  )
}

export default DocLink

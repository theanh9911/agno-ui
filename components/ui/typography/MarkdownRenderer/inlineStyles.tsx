import { useState } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import Code from '@/components/common/Code'
import { cn } from '@/utils/cn'
import type {
  UnorderedListProps,
  OrderedListProps,
  EmphasizedTextProps,
  ItalicTextProps,
  StrongTextProps,
  BoldTextProps,
  DeletedTextProps,
  UnderlinedTextProps,
  HorizontalRuleProps,
  BlockquoteProps,
  AnchorLinkProps,
  PreparedTextProps,
  HeadingProps,
  ImgProps,
  ParagraphProps
} from './types'
import { PARAGRAPH_SIZES } from '../Paragraph/constants'

const filterProps = (props: object) => {
  const newProps = { ...props }
  if ('node' in newProps) {
    delete newProps.node
  }
  return newProps
}
const UnorderedList = ({ className, ...props }: UnorderedListProps) => (
  <ul
    className={cn(
      className,
      PARAGRAPH_SIZES.lead,
      'flex list-disc flex-col gap-y-2 pl-5'
    )}
    {...filterProps(props)}
  />
)
const OrderedList = ({ className, ...props }: OrderedListProps) => (
  <ol
    className={cn(
      className,
      PARAGRAPH_SIZES.lead,
      'flex list-decimal flex-col gap-y-2 pl-5'
    )}
    {...filterProps(props)}
  />
)
const Paragraph = ({ className, ...props }: ParagraphProps) => (
  <span
    className={cn(className, PARAGRAPH_SIZES.lead, 'whitespace-pre-wrap')}
    {...filterProps(props)}
  />
)
const EmphasizedText = ({ className, ...props }: EmphasizedTextProps) => (
  <em
    className={cn(className, 'PARAGRAPH_SIZES.lead')}
    {...filterProps(props)}
  />
)
const ItalicText = ({ className, ...props }: ItalicTextProps) => (
  <i className={cn(className, PARAGRAPH_SIZES.lead)} {...filterProps(props)} />
)
const StrongText = ({ className, ...props }: StrongTextProps) => (
  <strong className={cn(className, 'font-semibold')} {...filterProps(props)} />
)
const BoldText = ({ className, ...props }: BoldTextProps) => (
  <b className={cn(className, 'font-semibold')} {...filterProps(props)} />
)
const UnderlinedText = ({ className, ...props }: UnderlinedTextProps) => (
  <u
    className={cn(className, 'underline', PARAGRAPH_SIZES.lead)}
    {...filterProps(props)}
  />
)
const DeletedText = ({ className, ...props }: DeletedTextProps) => (
  <del
    className={cn(className, 'text-muted line-through', PARAGRAPH_SIZES.lead)}
    {...filterProps(props)}
  />
)
const HorizontalRule = ({ className, ...props }: HorizontalRuleProps) => (
  <hr
    className={cn(className, 'mt-4 h-px w-full border-0 bg-border')}
    {...filterProps(props)}
  />
)
const PreparedText = ({ children }: PreparedTextProps) => (
  <Code useBackground={false} className={cn('break-words bg-secondary/50 p-2')}>
    {children}
  </Code>
)
const InlineCode = ({ children }: PreparedTextProps) => (
  <code className="relative rounded-sm bg-secondary px-1 py-0.5 font-dmmono">
    {children}
  </code>
)
const Blockquote = ({ className, ...props }: BlockquoteProps) => (
  <blockquote
    className={cn(
      className,
      'border-l-4 border-border pl-4 italic leading-snug text-muted [&>p]:whitespace-normal',
      PARAGRAPH_SIZES.lead
    )}
    {...filterProps(props)}
  />
)
const AnchorLink = ({ className, ...props }: AnchorLinkProps) => {
  const url = props.href || ''
  const isFootnoteRef =
    url.startsWith('#user-content-fn-') || url.startsWith('#fn')
  const isFootnoteBackref = url.startsWith('#user-content-fnref-')

  // Handle footnote references - show as superscript number
  if (isFootnoteRef) {
    const footnoteNum = url.match(/\d+/)?.[0] || '?'
    return (
      <sup className="ml-0.5">
        <a
          href={url}
          className={cn(
            className,
            'text-muted-foreground hover:text-foreground cursor-pointer text-[0.7rem] no-underline'
          )}
          {...filterProps(props)}
        >
          [{footnoteNum}]
        </a>
      </sup>
    )
  }

  // Handle footnote backreferences - show as return arrow
  if (isFootnoteBackref) {
    return (
      <a
        href={url}
        className={cn(
          className,
          'text-muted-foreground hover:text-foreground ml-1 no-underline'
        )}
        {...filterProps(props)}
      >
        ↩
      </a>
    )
  }

  return (
    <a
      className={cn(className, 'cursor-pointer underline')}
      target="_blank"
      rel="noopener noreferrer"
      {...filterProps(props)}
    />
  )
}
const Heading1 = ({ className, ...props }: HeadingProps) => (
  <h1
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.5rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Heading2 = ({ className, ...props }: HeadingProps) => (
  <h2
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.25rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Heading3 = ({ className, ...props }: HeadingProps) => (
  <h3
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.25rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Heading4 = ({ className, ...props }: HeadingProps) => (
  <h4
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.25rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Heading5 = ({ className, ...props }: HeadingProps) => (
  <h5
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.25rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Heading6 = ({ className, ...props }: HeadingProps) => (
  <h6
    className={cn(
      className,
      'mb-[-0.75rem] flex items-center gap-2 font-inter text-[1.25rem] font-medium leading-[normal] tracking-[-0.02em]'
    )}
    {...filterProps(props)}
  />
)
const Img = ({ src, alt }: ImgProps) => {
  const [error, setError] = useState(false)
  if (!src) return null
  return (
    <div className="w-full max-w-xl">
      {error ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md bg-secondary/50 text-muted">
          <Paragraph className="text-primary">Image unavailable</Paragraph>
          <Link
            href={src}
            target="_blank"
            className="max-w-md truncate underline"
          >
            {src}
          </Link>
        </div>
      ) : (
        <Image
          src={src}
          width={96}
          height={56}
          alt={alt ?? 'Rendered image'}
          className="size-full rounded-md object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}
export const inlineComponents = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  ul: UnorderedList,
  ol: OrderedList,
  em: EmphasizedText,
  i: ItalicText,
  strong: StrongText,
  b: BoldText,
  u: UnderlinedText,
  del: DeletedText,
  hr: HorizontalRule,
  pre: PreparedText,
  blockquote: Blockquote,
  code: InlineCode,
  a: AnchorLink,
  img: Img,
  p: Paragraph
}

import { FC, useState } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
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
  ParagraphProps,
  TableHeaderCellProps,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps
} from './types'
import { PARAGRAPH_SIZES } from '../Paragraph/constants'
import React from 'react'
import CopyButton from '@/components/common/CopyButton'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import Tooltip from '@/components/common/Tooltip'
import { formatUrl, stripWWW } from './utils'

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
      PARAGRAPH_SIZES.body,
      'flex list-disc flex-col gap-y-2 pl-5'
    )}
    {...filterProps(props)}
  />
)
const OrderedList = ({ className, ...props }: OrderedListProps) => (
  <ol
    className={cn(
      className,
      PARAGRAPH_SIZES.body,
      'flex list-decimal flex-col gap-y-2 pl-5'
    )}
    {...filterProps(props)}
  />
)
const Paragraph = ({ className, ...props }: ParagraphProps) => (
  <p
    className={cn(className, PARAGRAPH_SIZES.body, 'whitespace-pre-wrap')}
    {...filterProps(props)}
  />
)
const EmphasizedText = ({ className, ...props }: EmphasizedTextProps) => (
  <em
    className={cn(className, 'text-sm font-semibold')}
    {...filterProps(props)}
  />
)
const ItalicText = ({ className, ...props }: ItalicTextProps) => (
  <i
    className={cn(className, 'italic', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)
const StrongText = ({ className, ...props }: StrongTextProps) => (
  <strong className={cn(className, 'font-semibold')} {...filterProps(props)} />
)
const BoldText = ({ className, ...props }: BoldTextProps) => (
  <b className={cn(className, 'font-semibold')} {...filterProps(props)} />
)
const UnderlinedText = ({ className, ...props }: UnderlinedTextProps) => (
  <u
    className={cn(className, 'underline', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)
const DeletedText = ({ className, ...props }: DeletedTextProps) => (
  <del
    className={cn(className, 'text-muted line-through', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)
const HorizontalRule = ({ className, ...props }: HorizontalRuleProps) => (
  <hr
    className={cn(className, 'mt-4 h-px w-full border-0 bg-border')}
    {...filterProps(props)}
  />
)
const InlineCode: FC<PreparedTextProps> = ({ children }) => {
  return (
    <code className="relative rounded-sm bg-secondary px-1 py-0.5 font-dmmono">
      {children}
    </code>
  )
}
const CodeBlock = ({ children, className }: PreparedTextProps) => {
  const language = className?.replace(/language-/, '') || 'text'
  let content = ''
  // Handle different types of content
  if (typeof children === 'string') {
    content = children
  } else {
    content = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === 'string') return child
        if (React.isValidElement(child)) {
          // @ts-expect-error - internal React Markdown prop
          const childContent = child.props?.children
          if (Array.isArray(childContent)) {
            return childContent.join('')
          }
          return childContent || ''
        }
        return ''
      })
      .join('')
  }
  return (
    <pre className="relative my-2 whitespace-pre-wrap rounded-md bg-secondary/50 p-4 text-sm">
      <div className="absolute right-2 top-2">
        <CopyButton content={content} className="z-50 h-8 w-8 p-0" />
      </div>
      <code className={`mr-4 block break-words language-${language}`}>
        {content}
      </code>
    </pre>
  )
}
const Blockquote = ({ className, ...props }: BlockquoteProps) => (
  <blockquote
    className={cn(
      className,
      'border-l-4 border-border pl-4 italic leading-snug text-muted [&>p]:whitespace-normal',
      PARAGRAPH_SIZES.body
    )}
    {...filterProps(props)}
  />
)
const AnchorLink = ({ className, ...props }: AnchorLinkProps) => {
  const url = props.href || ''
  const isEmail = url.startsWith('mailto:')
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

  const favicon = isEmail
    ? undefined
    : `https://www.google.com/s2/favicons?domain=${url}&sz=32`
  const linkContent = (
    <a
      className={cn(
        className,
        'group mx-1 inline-flex items-center gap-1 font-inter font-medium leading-5 tracking-[-0.28px] underline underline-offset-4'
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...filterProps(props)}
    >
      <span>
        {isEmail ? url.replace('mailto:', '') : formatUrl(url)}
        {!isEmail && <ArrowTopRightIcon className="ml-0.5 inline size-4" />}
      </span>
    </a>
  )
  if (isEmail) {
    return linkContent
  }
  return (
    <Tooltip
      side="top"
      delayDuration={0}
      content={
        <span className="flex max-w-[400px] items-center gap-1">
          <img src={favicon} alt="Favicon" className="size-4 flex-shrink-0" />
          <span className="min-w-0 truncate">{stripWWW(url)}</span>
        </span>
      }
    >
      {linkContent}
    </Tooltip>
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
    <span className="inline-block w-full max-w-xl">
      {error ? (
        <span className="flex h-40 flex-col items-center justify-center gap-2 rounded-md bg-secondary/50 text-muted">
          <span className="text-sm text-primary">Image unavailable</span>
          <Link
            href={src}
            target="_blank"
            className="max-w-md truncate underline"
          >
            {src}
          </Link>
        </span>
      ) : (
        <Image
          src={src}
          width={1280}
          height={720}
          alt={alt ?? 'Rendered image'}
          className="size-full rounded-md object-cover"
          onError={() => setError(true)}
        />
      )}
    </span>
  )
}
const Table = ({ className, ...props }: TableProps) => (
  <div className="w-full overflow-hidden rounded-md border border-border">
    <div className="w-full overflow-x-auto">
      <table className={cn(className, 'w-full')} {...filterProps(props)} />
    </div>
  </div>
)
const TableHead = ({ className, ...props }: TableHeaderProps) => (
  <thead
    className={cn(
      className,
      'rounded-md border-b border-border bg-transparent p-2 text-left text-sm font-[600]'
    )}
    {...filterProps(props)}
  />
)
const TableHeadCell = ({ className, ...props }: TableHeaderCellProps) => (
  <th
    className={cn(className, 'p-2 text-sm font-[600]')}
    {...filterProps(props)}
  />
)
const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody className={cn(className, 'text-xs')} {...filterProps(props)} />
)
const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr
    className={cn(className, 'border-b border-border last:border-b-0')}
    {...filterProps(props)}
  />
)
const TableCell = ({ className, children, ...props }: TableCellProps) => {
  // Remove paragraph wrappers from table cell content to avoid nested <p> tags
  // Table cells should contain inline content directly
  const processedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      typeof child.type === 'function' &&
      child.type === Paragraph
    ) {
      return (child.props as { children?: React.ReactNode }).children
    }
    return child
  })

  return (
    <td
      className={cn(className, 'whitespace-nowrap p-2 font-[400]')}
      {...filterProps(props)}
    >
      {processedChildren}
    </td>
  )
}
export const components = {
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
  pre: CodeBlock,
  blockquote: Blockquote,
  code: InlineCode,
  a: AnchorLink,
  img: Img,
  p: Paragraph,
  table: Table,
  thead: TableHead,
  th: TableHeadCell,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell
}

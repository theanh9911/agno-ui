import { type FC, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import type { Element } from 'hast'
import 'katex/dist/katex.min.css'

import { cn } from '@/utils/cn'

import { inlineComponents } from './inlineStyles'
import { components } from './styles'
import Code from './plugins/code'
import { type MarkdownRendererProps } from './types'

interface MarkdownCodeProps {
  node?: unknown
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const MarkdownRenderer: FC<MarkdownRendererProps> = memo(
  ({ children, classname, inline = false }) => (
    <ReactMarkdown
      className={cn(
        'prose prose-h1:text-xl dark:prose-invert flex w-full flex-col gap-y-6 rounded-lg',
        '[&_section[data-footnotes]]:mt-8 [&_section[data-footnotes]]:border-t [&_section[data-footnotes]]:border-border [&_section[data-footnotes]]:pt-4',
        '[&_section[data-footnotes]_ol]:text-muted-foreground [&_section[data-footnotes]_ol]:text-sm',
        '[&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden',
        '[&_.katex]:text-base',
        classname
      )}
      components={{
        ...(inline ? inlineComponents : components),
        code: ({ node, inline, className, children }: MarkdownCodeProps) => (
          <Code node={node as Element} inline={inline} className={className}>
            {children}
          </Code>
        ),
        pre: ({ children }) => <div className="not-prose">{children}</div>
      }}
      remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  )
)

MarkdownRenderer.displayName = 'MarkdownRenderer'

export default MarkdownRenderer

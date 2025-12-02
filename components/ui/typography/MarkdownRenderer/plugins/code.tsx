import type { Element } from 'hast'

import { type FC, memo, type ReactNode } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from '@/components/common/CopyButton'

interface CodeProps {
  children?: ReactNode
  className?: string
  inline?: boolean
  node?: Element
}

const Code: FC<CodeProps> = memo(({ inline, className, children }) => {
  const content = String(children).replace(/\n$/, '')
  const isInlineCode = inline || (!className && !content.includes('\n'))
  if (isInlineCode) {
    return (
      <code className="relative rounded-sm bg-secondary px-1 py-0.5 font-dmmono">
        {content}
      </code>
    )
  }

  const language = className?.replace(/language-/, '') || 'text'

  return (
    <div className="relative my-1 w-full">
      <div className="absolute flex w-full items-center justify-between rounded-t-md bg-[#2c2c2c] px-3 py-2.5 text-xs text-gray-300">
        <div className="font-dmmono uppercase">{language}</div>
        <CopyButton content={content} className="text-white" />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '0.5rem 0.75rem',
          paddingTop: '3rem',
          fontSize: '0.85rem',
          lineHeight: '1.25',
          borderRadius: '0.5rem'
        }}
        PreTag="div"
      >
        {content}
      </SyntaxHighlighter>
    </div>
  )
})

Code.displayName = 'Code'

export default Code

import {
  type FC,
  useMemo,
  useRef,
  useEffect,
  useState,
  isValidElement
} from 'react'

import { PARAGRAPH_SIZES } from '@/components/ui/typography/Paragraph/constants'
import { cn } from '@/utils/cn'

import { BORDER_RADIUS } from './constants'
import { type CodeProps } from './types'
import { formatCode, formatNestedObject, parseCode } from './utils'

import CopyButton from '../CopyButton'

const Code: FC<CodeProps> = ({
  children,
  useBackground = true,
  className: classNameProp,
  fontSize = 'default',
  copyButton = false,
  textFont,
  classNameCodeBlock,
  formatAsNestedObject = false,
  renderAsHTML = false
}) => {
  const [HTML, setHTML] = useState('')

  const codeRef = useRef<HTMLDivElement | null>(null)

  const isJSX = isValidElement(children)

  const parsedCode = useMemo(() => {
    if (isJSX) return children
    return parseCode(children)
  }, [children, isJSX])

  let renderedCode

  if (isJSX) {
    renderedCode = children
  } else if (typeof parsedCode === 'object' && parsedCode != null) {
    renderedCode = formatAsNestedObject
      ? formatNestedObject(parsedCode)
      : formatCode(parsedCode)
  } else {
    renderedCode = String(parsedCode)
  }

  const className = cn(
    'w-full whitespace-pre-wrap leading-relaxed break-words overflow-x-auto rounded-none',
    useBackground && BORDER_RADIUS,
    useBackground && 'bg-secondary/50 p-2.5',
    fontSize === 'default' ? 'text-xs' : fontSize,
    copyButton && 'w-full',
    'relative rounded-md p-4',
    classNameProp
  )

  useEffect(() => {
    const currentHTML = codeRef?.current?.textContent
    setHTML(currentHTML ?? '')
  }, [children])

  const codeContent = (
    <>
      {renderedCode}
      {HTML && copyButton && (
        <CopyButton content={HTML} className="absolute right-2 top-2" />
      )}
    </>
  )

  return (
    <div className={cn('group relative overflow-hidden', BORDER_RADIUS)}>
      {renderAsHTML ? (
        <div className={cn(className, 'pr-8')} ref={codeRef}>
          {codeContent}
        </div>
      ) : (
        <pre className={cn(className, 'pr-8')}>
          <code
            ref={codeRef}
            className={cn(
              'block w-[90%] pr-8',
              PARAGRAPH_SIZES.body,
              textFont && textFont,
              classNameCodeBlock && classNameCodeBlock
            )}
          >
            {codeContent}
          </code>
        </pre>
      )}
    </div>
  )
}

export default Code

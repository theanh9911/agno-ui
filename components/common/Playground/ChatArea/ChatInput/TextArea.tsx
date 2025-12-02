import * as React from 'react'

import { cn } from '@/utils/cn'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  /** Optional overlay rendered inside the textarea container, bottom-right aligned */
  overlay?: React.ReactNode
}

const MIN_HEIGHT = 31
const MAX_HEIGHT = 213

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, value, onClick, onChange, overlay, ...props },
    forwardedRef
  ) => {
    const [showScroll, setShowScroll] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.style.height = `${MIN_HEIGHT}px`
      const { scrollHeight } = textarea
      const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
      textarea.style.height = `${newHeight}px`
      setShowScroll(scrollHeight > MAX_HEIGHT)
    }, [])

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const cursorPosition = e.target.selectionStart
        onChange?.(e)
        requestAnimationFrame(() => {
          adjustHeight()
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(
              cursorPosition,
              cursorPosition
            )
          }
        })
      },
      [onChange, adjustHeight]
    )

    const handleRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        const ref = forwardedRef as
          | React.MutableRefObject<HTMLTextAreaElement | null>
          | ((instance: HTMLTextAreaElement | null) => void)
          | null

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        textareaRef.current = node
      },
      [forwardedRef]
    )

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_HEIGHT}px`
        adjustHeight()
      }
    }, [value, adjustHeight])

    return (
      <div className="relative flex w-full items-center">
        <textarea
          className={cn(
            'z-100 w-full resize-none shadow-sm',
            'rounded-md border border-border',
            'font-inter text-[0.875rem] font-normal leading-[21px] tracking-[-0.02em] text-primary',
            'placeholder:text-muted/50',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            showScroll ? 'overflow-y-auto' : 'overflow-hidden',
            'whitespace-pre-wrap break-words',
            className
          )}
          style={{
            paddingRight: overlay ? '64px' : '12px',
            minHeight: `${MIN_HEIGHT}px`,
            maxHeight: `${MAX_HEIGHT}px`
          }}
          ref={handleRef}
          value={value}
          onChange={handleChange}
          onClick={onClick}
          {...props}
        />
        {overlay ? (
          <div className="pointer-events-auto absolute right-2 flex h-full items-center justify-center gap-2">
            {overlay}
          </div>
        ) : null}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export type { TextAreaProps }
export { TextArea }

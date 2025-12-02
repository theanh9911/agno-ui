import React, { type FC, type ReactNode } from 'react'

import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'

import Code from '../../Code'
import { type ToolProps } from '../Tools/type'
import { type IconType } from '@/components/ui/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Tooltip from '@/components/common/Tooltip'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'

export interface InfoDetailsProps extends Partial<ToolProps> {
  tooltip?: string
  title: string
  icon: IconType
  content?: ReactNode | string | object
  hover?: boolean
  className?: string

  mode?:
    | 'display'
    | 'input'
    | 'textarea'
    | 'file'
    | 'select'
    | 'markdown'
    | 'json'
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  value?: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  error?: string
  codeCopyButton?: boolean
  options?: { value: string; label: string; description?: string }[]
}

const InfoDetails: FC<InfoDetailsProps> = ({
  tooltip,
  content,
  icon,
  title,
  hover,
  className,
  mode = 'code',
  inputProps,
  textareaProps,
  value,
  onChange,
  placeholder,
  disabled = false,
  codeCopyButton = true,
  error,
  options
}) => {
  const stringifyContent = (content: object | React.ReactNode) => {
    // If it's a string, try to parse it as JSON if valid use the result to stringify, if not valid use it as is markdown
    // If it's an object/array, try to stringify it if valid use the result, if not valid use it as is markdown
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content)
        // If parsed result is an object/array, stringify for formatting
        if (typeof parsed === 'object' && parsed !== null) {
          return JSON.stringify(parsed, null, 2)
        }
        // If it parses to a primitive/string, it's markdown - render as-is
        return <MarkdownRenderer>{content}</MarkdownRenderer>
      } catch {
        return <MarkdownRenderer>{content}</MarkdownRenderer>
      }
    }

    // If it's an object/array, stringify it
    if (typeof content === 'object' && content !== null) {
      try {
        return JSON.stringify(content, null, 2)
      } catch {
        // Non-serializable objects
        return <MarkdownRenderer>{String(content)}</MarkdownRenderer>
      }
    }

    return <MarkdownRenderer>{String(content)}</MarkdownRenderer>
  }

  const renderContent = () => {
    switch (mode) {
      case 'input':
        return (
          <div className="space-y-1">
            <Input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn('w-full', error && 'border-destructive')}
              {...inputProps}
            />
            {error && (
              <Paragraph size="xs" className="text-destructive">
                {error}
              </Paragraph>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-1">
            <Textarea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              error={!!error}
              className="w-full resize-none"
              rows={3}
              {...textareaProps}
            />
            {error && (
              <Paragraph size="xs" className="text-destructive">
                {error}
              </Paragraph>
            )}
          </div>
        )

      case 'file':
        return (
          <div className="space-y-1">
            <Input
              type="file"
              onChange={onChange}
              disabled={disabled}
              className={cn('w-full', error && 'border-destructive')}
              {...inputProps}
            />
            {error && (
              <Paragraph size="xs" className="text-destructive">
                {error}
              </Paragraph>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-1">
            <Select
              value={value}
              onValueChange={(val) =>
                onChange?.({
                  target: { value: val }
                } as unknown as React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement
                >)
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  'w-full overflow-visible',
                  error && 'border-destructive'
                )}
              >
                <SelectValue placeholder={placeholder}>
                  {value && options?.find((opt) => opt.value === value)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="overflow-visible">
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.description ? (
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        <Tooltip
                          content={option.description}
                          contentClassName="absolute z-50 text-wrap  break-words min-w-[19.125rem] mt-4"
                        >
                          <Icon
                            type="info"
                            size="xs"
                            className="text-muted-foreground hover:text-foreground"
                          />
                        </Tooltip>
                      </div>
                    ) : (
                      option.label
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <Paragraph size="xs" className="text-destructive">
                {error}
              </Paragraph>
            )}
          </div>
        )
      case 'markdown':
        return (
          <Code
            useBackground
            formatAsNestedObject
            copyButton={codeCopyButton}
            classNameCodeBlock="font-dmmono"
            className={cn(
              hover && 'group-hover:bg-accent/50',
              'overflow-auto font-dmmono',
              className
            )}
          >
            <MarkdownRenderer>{content?.toString()}</MarkdownRenderer>
          </Code>
        )
      case 'json':
        return (
          <Code
            useBackground
            formatAsNestedObject
            copyButton={codeCopyButton}
            classNameCodeBlock="font-dmmono"
            className={cn(
              hover && 'group-hover:bg-accent/50',
              'overflow-auto font-dmmono',
              className
            )}
          >
            {stringifyContent(content)}
          </Code>
        )
      case 'code':
      default:
        return (
          <Code
            useBackground
            formatAsNestedObject
            copyButton={codeCopyButton}
            classNameCodeBlock="font-dmmono"
            className={cn(
              hover && 'group-hover:bg-accent/50',
              'overflow-auto font-dmmono',
              className
            )}
          >
            {content}
          </Code>
        )
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex gap-2 pl-1">
        <Icon size="xs" type={icon} className="text-muted" />
        {tooltip ? (
          <Tooltip
            content={tooltip}
            contentClassName="absolute z-50 text-wrap break-words min-w-[19.125rem] mt-4"
          >
            <Paragraph
              size="xs"
              className="text-muted underline decoration-dotted"
            >
              {title}
            </Paragraph>
          </Tooltip>
        ) : (
          <Paragraph size="xs" className="text-muted">
            {title}
          </Paragraph>
        )}
      </div>
      {renderContent()}
    </div>
  )
}

export default InfoDetails

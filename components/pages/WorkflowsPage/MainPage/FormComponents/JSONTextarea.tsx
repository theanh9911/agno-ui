import { memo, useState, useCallback } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import Tooltip from '@/components/common/Tooltip'
import Icon from '@/components/ui/icon'

interface JSONTextareaProps {
  label: string
  description?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * JSON Textarea component for complex object input with validation
 * Validates JSON format and provides user feedback
 */
const JSONTextarea = memo(
  ({
    label,
    description,
    required = false,
    value,
    onChange
  }: JSONTextareaProps) => {
    const [isValidJSON, setIsValidJSON] = useState(true)
    const [jsonError, setJsonError] = useState<string | null>(null)

    const validateJSON = useCallback((jsonString: string) => {
      if (!jsonString.trim()) {
        setIsValidJSON(true)
        setJsonError(null)
        return true
      }

      try {
        JSON.parse(jsonString)
        setIsValidJSON(true)
        setJsonError(null)
        return true
      } catch (error) {
        setIsValidJSON(false)
        setJsonError(
          error instanceof Error ? error.message : 'Invalid JSON format'
        )
        return false
      }
    }, [])

    const handleChange = useCallback(
      (newValue: string) => {
        onChange(newValue)
        validateJSON(newValue)
      },
      [onChange, validateJSON]
    )

    const formatJSON = useCallback(() => {
      if (!value.trim()) return

      try {
        const parsed = JSON.parse(value)
        const formatted = JSON.stringify(parsed, null, 2)
        onChange(formatted)
        setIsValidJSON(true)
        setJsonError(null)
      } catch {
        // Keep current value if invalid
      }
    }, [value, onChange])

    return (
      <div className="flex w-full flex-col justify-start gap-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <span className="font-dmmono text-xs font-normal uppercase">
              {label}
            </span>
            {required && <span className="text-xs text-red-500">*</span>}
            {description && (
              <Tooltip
                content={description}
                delayDuration={0}
                side="top"
                contentClassName="max-w-xs"
              >
                <Icon type="info" className="text-muted/80" size="xs" />
              </Tooltip>
            )}
          </div>
          {value.trim() && (
            <Button
              type="button"
              variant="ghost"
              onClick={formatJSON}
              disabled={!isValidJSON}
              className="border-none bg-background text-xs"
            >
              Format
            </Button>
          )}
        </div>

        <Paragraph size="xs">Enter input in JSON format</Paragraph>

        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className={`resize-none font-mono text-xs text-primary ${
            !isValidJSON ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />

        {!isValidJSON && jsonError && (
          <Paragraph size="xs" className="break-words text-red-500">
            {jsonError}
          </Paragraph>
        )}
      </div>
    )
  }
)

JSONTextarea.displayName = 'JSONTextarea'

export default JSONTextarea

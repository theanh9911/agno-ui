import React, { useCallback, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TagList from './TagList'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxTags?: number
  allowDuplicates?: boolean
  className?: string
  existingTags?: string[]
  systemTags?: string[]
  'aria-describedby'?: string
  onCommitPendingTag?: { current: (() => boolean) | null }
  inputClassName?: string
  onEmptyEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Type your tag and press enter to add them to the tag list',
  disabled = false,
  maxTags,
  allowDuplicates = false,
  className = '',
  'aria-describedby': ariaDescribedBy,
  onCommitPendingTag,
  inputClassName = '',
  onEmptyEnter
}) => {
  const [inputValue, setInputValue] = useState('')

  const commitPendingTag = useCallback(() => {
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      return false
    }

    if (maxTags && tags.length >= maxTags) {
      return false
    }

    if (!allowDuplicates && tags.includes(trimmedValue)) {
      return false
    }

    onTagsChange([...tags, trimmedValue])
    setInputValue('')
    return true
  }, [inputValue, tags, onTagsChange, maxTags, allowDuplicates])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (inputValue.trim().length > 0) {
          e.preventDefault()
          e.stopPropagation()
          commitPendingTag()
        } else if (onEmptyEnter) {
          // Input is empty, call the callback
          e.preventDefault()
          e.stopPropagation()
          onEmptyEnter(e)
        }
      } else if (e.key === 'Tab' && inputValue.trim().length > 0) {
        e.preventDefault()
        e.stopPropagation()
        commitPendingTag()
      }
    },
    [commitPendingTag, inputValue, onEmptyEnter]
  )

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove))
    },
    [tags, onTagsChange]
  )

  const isMaxReached = maxTags ? tags.length >= maxTags : false

  const canAddTag =
    inputValue.trim().length > 0 &&
    (!maxTags || tags.length < maxTags) &&
    (allowDuplicates || !tags.includes(inputValue.trim()))

  // Expose the commitPendingTag function to parent
  useEffect(() => {
    if (onCommitPendingTag) {
      onCommitPendingTag.current = commitPendingTag
    }
  }, [onCommitPendingTag, commitPendingTag])

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isMaxReached ? `Maximum ${maxTags} tags allowed` : placeholder
          }
          onKeyDown={handleKeyDown}
          disabled={disabled || isMaxReached}
          aria-describedby={ariaDescribedBy}
          className={inputClassName}
        />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="flex-shrink-0"
          disabled={!canAddTag || disabled}
          onClick={commitPendingTag}
          tabIndex={-1}
          icon="plus"
        >
          <span className="sr-only">Add tag</span>
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="mt-2">
          <TagList
            tags={tags}
            wrapLimit={tags?.length}
            removable
            onClick={removeTag}
          />
        </div>
      )}

      {maxTags && (
        <div className="text-muted-foreground text-xs">
          {tags.length}/{maxTags} tags
        </div>
      )}
    </div>
  )
}

export default TagInput

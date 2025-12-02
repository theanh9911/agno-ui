import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

interface InlineInputProps {
  onSave: (value: string) => void
  onCancel: () => void
}

export const InlineInput = ({ onSave, onCancel }: InlineInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current?.value?.trim()
    if (value) {
      onSave(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="absolute left-9 top-0 z-50 mt-[-10px] w-[200px]">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-md border border-border bg-background shadow-lg">
          <Input
            ref={inputRef}
            className="h-8 border-0 pr-16 text-xs placeholder:text-xs placeholder:text-muted"
            placeholder="New name"
            onKeyDown={handleKeyDown}
            onBlur={onCancel}
            autoFocus
          />
          <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <Button
              type="submit"
              className="h-6 w-6 p-0"
              variant="ghost"
              icon="return"
              size={'iconXs'}
              onMouseDown={(e) => e.preventDefault()}
            />
            <Button
              type="button"
              className="h-6 w-7 p-0"
              variant="ghost"
              onClick={onCancel}
            >
              <span className="text-xs uppercase tracking-[-0.28px] text-primary">
                Esc
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

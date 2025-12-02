import { parseLabel } from '@/utils/playgroundUtils'
import { Label } from '@/components/ui/label'

export function WorkflowParsedLabels({ message }: { message: string }) {
  if (!message) return null
  const entries = parseLabel(message)
  if (!entries?.length) return null

  const preparedEntries = entries
    .filter(({ value }) => !(Array.isArray(value) && !value.length))
    .map(({ key, value }) => {
      const displayValue = Array.isArray(value)
        ? `[${(value as string[]).join(', ')}]`
        : String(value)
      return { key, displayValue }
    })

  if (!preparedEntries?.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {preparedEntries.map(({ key, displayValue }) => (
        <Label
          key={`${message}-${key}`}
          className="rounded-sm border border-border bg-transparent px-1.5 py-0.5 font-dmmono text-xs font-normal uppercase text-primary"
        >
          {`${key} = ${displayValue}`}
        </Label>
      ))}
    </div>
  )
}

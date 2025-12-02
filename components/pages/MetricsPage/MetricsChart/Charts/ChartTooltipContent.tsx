import { type FC } from 'react'
import Paragraph from '@/components/ui/typography/Paragraph'
import { formatDate, formatLargeNumber } from '@/utils/format'

export interface TooltipPayloadEntry {
  value: number
  name: string
  dataKey: string
  color?: string
  payload?: object
  stroke?: string
  fill?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<TooltipPayloadEntry>
  label?: string
  labelFormatter?: (label: string) => string | number
  getIndicatorColor?: (entry: TooltipPayloadEntry) => string
  formatEntryName?: (name: string, entry: TooltipPayloadEntry) => string
  sortPayloadEntries?: (
    payload: Array<TooltipPayloadEntry>
  ) => Array<TooltipPayloadEntry>
  renderIndicator?: (entry: TooltipPayloadEntry) => React.ReactNode
}

const ChartTooltipContent: FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  labelFormatter,
  getIndicatorColor,
  formatEntryName,
  sortPayloadEntries,
  renderIndicator
}) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload.filter((entry) => entry.value !== 0)

    if (filteredPayload.length === 0) {
      return null
    }

    const finalLabel = label
      ? labelFormatter
        ? labelFormatter(label)
        : formatDate(label, 'chart')
      : ''

    let processedPayload = filteredPayload
    if (sortPayloadEntries) {
      processedPayload = sortPayloadEntries([...filteredPayload])
    }

    return (
      <div className="rounded-md bg-background p-3 shadow-md">
        {finalLabel && (
          <Paragraph size="mono" className="mb-2 uppercase text-primary/50">
            {finalLabel}
          </Paragraph>
        )}
        {processedPayload.map((entry, index) => {
          const displayName = formatEntryName
            ? formatEntryName(entry.name, entry)
            : entry.name

          const indicatorNode = renderIndicator ? (
            renderIndicator(entry)
          ) : (
            <div
              className="h-3 w-7 rounded-sm"
              style={{
                backgroundColor: getIndicatorColor
                  ? getIndicatorColor(entry)
                  : entry.fill || entry.color || 'rgb(var(--color-brand-brand))'
              }}
            />
          )

          return (
            <div
              key={index}
              className="mt-2 flex w-[14.25rem] items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {indicatorNode}
                <Paragraph size="mono" className="text-primary">
                  {formatLargeNumber(entry.value)}
                </Paragraph>
              </div>
              <Paragraph size="mono" className="ml-6 uppercase text-primary/60">
                {displayName}
              </Paragraph>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export default ChartTooltipContent

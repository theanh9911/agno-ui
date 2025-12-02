import React from 'react'
import Icon from '@/components/ui/icon'
import Tooltip from '@/components/common/Tooltip'
import Paragraph from '@/components/ui/typography/Paragraph'
import { getProviderIcon } from '@/utils/modelProvider'

interface ModelListEntry {
  name: string
  model_provider: string
  value: number
}

interface ModelListProps {
  chartData: ModelListEntry[]
  hoveredModelName: string | null
  setHoveredModelName: (name: string | null) => void
}

const ModelList: React.FC<ModelListProps> = ({
  chartData,
  hoveredModelName,
  setHoveredModelName
}) => {
  const isSingleItem = chartData?.length === 1
  const gridColsClass = isSingleItem ? 'grid-cols-1' : 'grid-cols-2'

  return (
    <div
      className={`relative mt-[-85px] grid w-[23rem] ${gridColsClass} justify-items-center gap-4`}
    >
      {chartData?.map((entry, index) => {
        const providerName = entry?.model_provider
        const iconType =
          entry?.name !== 'Others' && providerName
            ? getProviderIcon(providerName)
            : null
        const displayName = entry?.name
        const maxNameLength = iconType ? 7 : 10
        const isHovered = hoveredModelName === entry?.name

        const dotBgColorClass = isHovered ? 'bg-brand' : 'bg-primary'
        const dotOpacity = Math.max(0.2, 1.0 - index * 0.2)

        return (
          <div
            key={index}
            className="flex h-[24px] w-[11rem] cursor-pointer items-center justify-between rounded-[4px] bg-secondary/80 px-2"
            onMouseEnter={() => setHoveredModelName(entry?.name)}
            onMouseLeave={() => setHoveredModelName(null)}
          >
            <div className="flex max-w-[104px] flex-1 items-center justify-between overflow-hidden">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${dotBgColorClass}`}
                  style={{ opacity: dotOpacity }}
                ></div>
                <div className="flex min-w-0 items-center gap-1">
                  {displayName.length > maxNameLength ? (
                    <Tooltip
                      content={displayName}
                      delayDuration={1}
                      side="bottom"
                    >
                      <Paragraph
                        size="mono"
                        className="truncate font-normal text-muted"
                      >
                        {`${displayName.substring(0, maxNameLength)}...`}
                      </Paragraph>
                    </Tooltip>
                  ) : (
                    <Paragraph size="mono" className="font-normal text-muted">
                      {displayName}
                    </Paragraph>
                  )}
                </div>
              </div>
              {iconType && (
                <div className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-background">
                  <Icon type={iconType} className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
            <Paragraph
              size="mono"
              className="flex-shrink-0 pl-1 font-normal text-primary"
            >
              {Math.round(entry?.value)}%
            </Paragraph>
          </div>
        )
      })}
    </div>
  )
}

export default ModelList

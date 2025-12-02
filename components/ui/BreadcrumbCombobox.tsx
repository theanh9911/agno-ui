import { useState, useRef, type FC, ReactNode } from 'react'
import { BreadcrumbItem, BreadcrumbTextItem } from '@/components/ui/breadcrumb'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem
} from '@/components/ui/command'
import Tooltip from '@/components/common/Tooltip/Tooltip'
import { cn } from '@/utils/cn'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import type { IconType } from '@/components/ui/icon'

type ComboboxItem = {
  value: string
  label: ReactNode
  name?: string
}

type HeaderAction = {
  onClick: () => void
  icon: IconType
}

type HeaderConfig = {
  title: string
  actions?: HeaderAction[]
}

const Header = ({ title, actions }: HeaderConfig) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between bg-secondary px-2 py-1.5">
        <div className="flex flex-col">
          <Paragraph size="title" className="text-muted">
            {title}
          </Paragraph>
        </div>
        {actions && actions[0] && (
          <PopoverClose asChild>
            <Button
              variant="outline"
              size="iconSmall"
              icon={actions[0].icon}
              onClick={actions[0].onClick}
            />
          </PopoverClose>
        )}
      </div>
      <div className="h-px bg-border" />
    </div>
  )
}

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

type BreadcrumbComboboxProps = {
  selectedItem: ComboboxItem
  itemList?: ComboboxItem[]
  onItemSelect?: (value: string) => void
  onClick?: () => void
  isDropdownListPresent?: boolean
  enableSearch?: boolean
  header?: HeaderConfig
  popoverWidth?: string
  showOnHover?: boolean
  tooltipLength?: number
  tooltipSide?: TooltipSide
  triggerTooltipSide?: TooltipSide
}

const renderBreadcrumbLabel = (
  item: ComboboxItem,
  triggerTooltipSide?: TooltipSide
) => {
  return typeof item.label === 'string' ? (
    item.label.length > 25 ? (
      <Tooltip
        side={triggerTooltipSide}
        delayDuration={0}
        content={item.label}
        contentClassName="flex flex-wrap max-w-[600px]"
        asChild
      >
        <BreadcrumbTextItem>{item.label}</BreadcrumbTextItem>
      </Tooltip>
    ) : (
      <BreadcrumbTextItem>{item.label}</BreadcrumbTextItem>
    )
  ) : item.name && item.name.length > 25 ? (
    <Tooltip
      side={triggerTooltipSide}
      delayDuration={0}
      content={item.name}
      contentClassName="flex flex-wrap max-w-[600px]"
      asChild
    >
      {item.label}
    </Tooltip>
  ) : (
    item.label
  )
}
const BreadcrumbCombobox: FC<BreadcrumbComboboxProps> = ({
  selectedItem,
  itemList,
  onItemSelect,
  onClick,
  isDropdownListPresent = true,
  enableSearch = false,
  header,
  popoverWidth = 'max-w-[400px] min-w-[200px] w-full',
  showOnHover = false,
  tooltipLength = 52,
  tooltipSide = 'top',
  triggerTooltipSide = 'bottom'
}) => {
  const [open, setOpen] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleOpenChange = (isOpen: boolean) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setOpen(isOpen)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showOnHover) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      setOpen(true)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showOnHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        setOpen(false)
        hoverTimeoutRef.current = null
      }, 150)
    }
  }

  const handleClick = () => {
    if (!showOnHover) {
      setOpen(!open)
    }
    onClick?.()
  }

  if (!itemList || itemList.length === 0) {
    return (
      <BreadcrumbItem
        key={selectedItem.value}
        aria-expanded={open}
        isDropdownListPresent={false}
        onClick={handleClick}
        className={cn(!onClick && 'cursor-default')}
      >
        {renderBreadcrumbLabel(selectedItem, triggerTooltipSide)}
      </BreadcrumbItem>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={(e) => e.stopPropagation()}
        onBlur={(e) => e.stopPropagation()}
      >
        <BreadcrumbItem
          key={selectedItem.value}
          aria-expanded={open}
          isDropdownListPresent={isDropdownListPresent}
        >
          {renderBreadcrumbLabel(selectedItem, triggerTooltipSide)}
        </BreadcrumbItem>
      </PopoverTrigger>
      <PopoverContent
        className={cn(popoverWidth, 'border border-border bg-background p-0')}
        align="start"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={(e) => e.stopPropagation()}
        onBlur={(e) => e.stopPropagation()}
      >
        {header && <Header {...header} />}
        <Command
          className="max-h-[320px] gap-1 p-1"
          onFocusCapture={(e) => {
            e.stopPropagation()
          }}
        >
          {enableSearch && <CommandInput placeholder="Search" />}
          <CommandList>
            <CommandEmpty>No items found</CommandEmpty>

            {itemList?.map((item, index) => {
              const isSelected = selectedItem.value === item.value
              const tooltipText =
                typeof item.label === 'string' ? item.label : item.name
              //TODO: figure out a way to do it without length check
              const shouldShowTooltip =
                tooltipText && tooltipText.length > tooltipLength

              const commandItem = (
                <CommandItem
                  key={`${item.value}-${index}`}
                  value={item.value}
                  onSelect={() => onItemSelect?.(item.value)}
                  disabled={selectedItem.value === item.value}
                  className={cn(isSelected && 'bg-brand/10')}
                >
                  <PopoverClose asChild>
                    <div className="flex w-full items-center justify-between gap-2 text-left">
                      <div className="min-w-0 flex-1">
                        {typeof item.label === 'string' ? (
                          <Paragraph
                            size="body"
                            className="truncate text-primary"
                          >
                            {item.label}
                          </Paragraph>
                        ) : (
                          <div className="truncate">{item.label}</div>
                        )}
                      </div>
                      {isSelected && (
                        <Icon
                          type="check"
                          size="xs"
                          className="flex-shrink-0 text-brand"
                        />
                      )}
                    </div>
                  </PopoverClose>
                </CommandItem>
              )

              return shouldShowTooltip ? (
                <Tooltip
                  key={`${item.value}-${index}`}
                  side={tooltipSide}
                  delayDuration={0}
                  content={tooltipText}
                  contentClassName="flex flex-wrap max-w-[600px]"
                >
                  {commandItem}
                </Tooltip>
              ) : (
                commandItem
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default BreadcrumbCombobox

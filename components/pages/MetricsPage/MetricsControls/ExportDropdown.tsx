import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Share2Icon } from '@radix-ui/react-icons'
import { cn } from '@/utils/cn'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'

interface ExportDropdownProps {
  onExport?: (type: 'csv' | 'json') => void
  className?: string
  triggerType?: 'button' | 'icon'
  disabled?: boolean
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  className,
  triggerType = 'button',
  disabled = false
}) => {
  const handleExport = (type: 'csv' | 'json') => {
    onExport?.(type)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(
          triggerType === 'button'
            ? 'flex h-9 w-[11.5rem] items-center justify-between gap-2 rounded-md bg-secondary/100 pl-4 pr-2 text-sm font-medium text-primary shadow-sm outline-none ring-0 hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-50'
            : 'z-100 flex h-8 w-8 items-center justify-center rounded-md outline-none ring-0 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        {triggerType === 'button' ? (
          <>
            <Share2Icon className="h-4 w-4" />
            <Paragraph size="mono" className="pr-4 text-primary">
              EXPORT ALL CHARTS
            </Paragraph>
          </>
        ) : (
          <Share2Icon className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[217px]">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className="flex w-full items-center gap-2"
        >
          <Icon type="csv" size="xs" />
          Export as .CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className="flex w-full items-center gap-2"
        >
          <Icon type="json" size="xs" />
          Export as .JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportDropdown

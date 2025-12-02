import type React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { BreadcrumbTextItem } from '@/components/ui/breadcrumb'
import Tooltip from '@/components/common/Tooltip/Tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface SessionOptionsDropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRename: (e: React.MouseEvent) => void
  onDelete: () => void
  onOpenSessionState?: () => void
  showSessionState?: boolean
  sessionId?: string
  sessionName?: string
  displayedName?: string
}

const SessionOptionsDropdown: React.FC<SessionOptionsDropdownProps> = ({
  open,
  onOpenChange,
  onRename,
  onDelete,
  onOpenSessionState,
  showSessionState,
  sessionId,
  sessionName,
  displayedName
}) => (
  <DropdownMenu modal={false} open={open} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger asChild>
      <div
        className={clsx(
          'flex h-[25px] max-w-[200px] cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-3.5 hover:bg-secondary/50',
          open && 'bg-secondary'
        )}
      >
        {sessionName && (
          <Tooltip
            content={sessionName}
            delayDuration={0}
            side="top"
            contentClassName="max-w-[600px]"
            asChild
          >
            <BreadcrumbTextItem className="min-w-0 flex-1 truncate">
              <motion.span
                key={sessionId}
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="truncate"
              >
                {displayedName}
              </motion.span>
            </BreadcrumbTextItem>
          </Tooltip>
        )}
        <Button
          variant="icon"
          size="icon"
          className="w-auto flex-shrink-0 border-none outline-none ring-0 hover:bg-transparent focus-visible:ring-0"
          icon="more-vertical"
        />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-[173px]">
      <DropdownMenuItem asChild>
        <button
          onClick={onRename}
          type="button"
          className="flex w-full items-center"
        >
          <Icon size="xs" type="pencil" className="mr-2" />
          Rename Session
        </button>
      </DropdownMenuItem>
      {showSessionState && (
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="flex w-full items-center"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onOpenChange(false)
              setTimeout(() => {
                if (onOpenSessionState) {
                  onOpenSessionState()
                }
              }, 0)
            }}
          >
            <Icon size="xs" type="braces" className="mr-2" />
            Session State
          </button>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onDelete} className="text-destructive">
        <Icon size="xs" type="trash" className="mr-2 text-destructive" />
        Delete Session
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default SessionOptionsDropdown

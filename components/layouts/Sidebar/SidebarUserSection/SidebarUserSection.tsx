import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ThemeToggleGroup from '@/components/layouts/Topbar/UserButton/ThemeToggleGroup'
import SignOutButton from '@/components/layouts/Topbar/UserButton/SignOutButton'
import { getInitials } from '@/utils/user'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { useUser } from '@/api/hooks/queries'
import Icon from '@/components/ui/icon'
import { useDialog } from '@/providers/DialogProvider'
import SettingsModal from '@/components/modals/SettingsModal/SettingsModal'

const SidebarUserSection = () => {
  const { openDialog } = useDialog()
  const { data } = useUser()
  const user = data?.user
  const name = user?.name ?? user?.username
  const email = user?.email ?? null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 px-2 py-2',
            'hover:bg-accent',
            'data-[state=open]:bg-accent'
          )}
        >
          <Avatar className="h-9 w-9">
            {name && getInitials(name)}
            {!name && email && getInitials(email)}
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <Paragraph size="xs" className="truncate font-medium text-primary">
              {name}
            </Paragraph>
            <Paragraph size="xsmall" className="truncate text-muted">
              {email}
            </Paragraph>
          </div>
          <Icon
            type="more-vertical"
            size="xs"
            className="shrink-0 text-muted"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="h-full w-[187px] overflow-hidden border shadow-md"
        side="top"
      >
        <div className="flex flex-col">
          <div className="p-2 hover:bg-transparent">
            <ThemeToggleGroup />
          </div>
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-sm p-2"
            onClick={() => openDialog(<SettingsModal defaultPage="profile" />)}
          >
            <Icon type="user" size="xs" className="mx-1 text-muted" />
            Profile Settings
          </DropdownMenuItem>
          <SignOutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SidebarUserSection

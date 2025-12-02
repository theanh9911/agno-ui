import { type FC } from 'react'
import { useSignOut } from '@/hooks/useSignOut'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Icon from '@/components/ui/icon'

const SignOutButton: FC = () => {
  const { signOut, isSigningOut } = useSignOut()

  const handleSignOut = async () => {
    await signOut()
  }

  if (isSigningOut) {
    return (
      <DropdownMenuItem className="flex w-full cursor-not-allowed items-center gap-2 rounded-sm text-destructive opacity-50">
        <Icon
          type="logout"
          size="xs"
          className="mx-1 animate-spin text-destructive"
        />
        Logging out...
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="flex w-full items-center gap-2 rounded-sm text-destructive"
    >
      <Icon type="logout" size="xs" className="mx-1 text-destructive" />
      Logout
    </DropdownMenuItem>
  )
}

export default SignOutButton

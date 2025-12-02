import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom'
import { forwardRef } from 'react'

interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string
  children: React.ReactNode
  onPrefetch?: (href: string) => void
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, onPrefetch, ...props }, ref) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onPrefetch?.(href)
      props.onMouseEnter?.(e)
    }

    return (
      <RouterLink
        ref={ref}
        to={href}
        {...props}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </RouterLink>
    )
  }
)

Link.displayName = 'Link'

export default Link

import React, { forwardRef } from 'react'
import { useRouteState } from '@/hooks/useRouteState'
import { cn } from '@/utils/cn'

// Use built-in anchor props for type safety
interface StatePreservingLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

/**
 * Enhanced Link component that automatically preserves route state
 * When clicked, it saves the current page state before navigating
 * AND automatically navigates to the saved state if it exists
 */
const StatePreservingLink = forwardRef<
  HTMLAnchorElement,
  StatePreservingLinkProps
>(({ href, children, className, onClick, onMouseEnter, ...props }, ref) => {
  const { navigateToPage } = useRouteState()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default only if it's an internal link
    if (href.startsWith('/') || href.startsWith('#')) {
      e.preventDefault()
      // Use navigateToPage which will automatically check for saved state
      // and navigate to the preserved URL if it exists
      navigateToPage(href)
    }
    // Call the original onClick if provided
    onClick?.(e)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(e)
  }

  return (
    <a
      ref={ref}
      href={href}
      className={cn('cursor-pointer', className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </a>
  )
})

StatePreservingLink.displayName = 'StatePreservingLink'

export default StatePreservingLink

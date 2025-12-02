import React from 'react'

interface SidebarActiveIndicatorProps {
  top: number | null
  height?: number
  className?: string
}

const SidebarActiveIndicator: React.FC<SidebarActiveIndicatorProps> = ({
  top,
  height = 36,
  className = ''
}) => {
  if (top === null) return null
  return (
    <div
      className={`absolute right-[-1px] z-10 w-[1px] bg-brand transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `translateY(${top}px)`,
        height: `${height}px`
      }}
    />
  )
}

export default SidebarActiveIndicator

import { Separator } from '@/components/ui/separator'
import React from 'react'

interface SidebarDividerProps {
  margin?: string
}

const SidebarDivider: React.FC<SidebarDividerProps> = ({ margin = 'mx-4' }) => {
  return <Separator className={`${margin} my-[7.5px] w-auto`} />
}

export default SidebarDivider

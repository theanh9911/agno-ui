import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import MainSidebar from '@/components/layouts/Sidebar'
import Topbar from '@/components/layouts/Topbar'

interface MainLayoutProps {
  children?: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <MainSidebar />
        <div className="relative flex-1 overflow-y-auto bg-background">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  )
}

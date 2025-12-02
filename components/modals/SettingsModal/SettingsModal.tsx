import React, { Suspense, useState, useEffect, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import HeaderWrapper from '@/components/layouts/Header/HeaderWrapper'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useDialog } from '@/providers/DialogProvider'

const OrganizationSettings = lazy(
  () => import('./OrganizationSettings/OrganizationSettings')
)
const OSSettings = lazy(() => import('./OSSettings/OSSettings'))
const BillingSettings = lazy(() => import('./Billing/BillingSettings'))
const ProfileSettings = lazy(() => import('./ProfileSettings/ProfileSettings'))
import { SettingsModalSidebar } from './components'
import { HeadingText } from '@/components/layouts/Header'
import { OSSelector } from './OSSettings/components'
import { useOSQuery } from '@/api/hooks'

interface SettingsModalProps {
  defaultPage?: string
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  defaultPage = 'profile'
}) => {
  const { closeDialog } = useDialog()
  const [currentPage, setCurrentPage] = useState(defaultPage)
  const [selectedOSIdForEdit, setSelectedOSIdForEdit] = useState<string | null>(
    null
  )
  const { data: osList } = useOSQuery()

  // Set the page when modal opens
  useEffect(() => {
    setCurrentPage(defaultPage)
  }, [defaultPage])

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    // Clear selected AgentOS when manually changing pages
    if (page !== 'os') {
      setSelectedOSIdForEdit(null)
    }
  }

  const handleEditOSConnection = (osId: string) => {
    setSelectedOSIdForEdit(osId)
    setCurrentPage('os')
  }

  const renderCurrentPage = () => {
    const PageComponent = () => {
      switch (currentPage) {
        case 'profile':
          return <ProfileSettings />
        case 'organization':
          return (
            <OrganizationSettings onEditOSConnection={handleEditOSConnection} />
          )
        case 'os':
          return <OSSettings selectedOSIdForEdit={selectedOSIdForEdit} />
        case 'billing':
          return <BillingSettings />
        default:
          return <ProfileSettings />
      }
    }

    return (
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        }
      >
        <PageComponent />
      </Suspense>
    )
  }

  const getPageTitle = () => {
    const pageMap: Record<string, string> = {
      profile: 'Profile',
      organization: 'Organization',
      workspaces: 'Workspaces',
      os: 'AgentOS',
      billing: 'Billing'
    }
    return pageMap[currentPage] || 'Settings'
  }

  const PAGE_RENDERERS = {
    getLeftContent: () => {
      const title = getPageTitle()
      const renderers: Record<string, () => React.ReactNode> = {
        os: () => {
          if (!osList || osList.length === 0) {
            return <HeadingText text={title} />
          }
          return <OSSelector />
        },
        default: () => <HeadingText text={title} />
      }
      return renderers[currentPage]?.() || renderers.default()
    },
    getBottomContent: () => {
      const renderers: Record<string, () => React.ReactNode> = {
        os: () => {
          if (osList && osList.length > 0) {
            return <HeadingText text="AgentOS" />
          }
          return null
        },
        default: () => null
      }
      return renderers[currentPage]?.() || renderers.default()
    }
  }

  return (
    <DialogContent className="h-[80vh] min-h-[80vh] w-full gap-0 p-0 md:max-w-[80%] xl:max-w-[80%]">
      <div className="flex h-full">
        <SettingsModalSidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isOpen={true}
        />

        {/* Settings Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <HeaderWrapper
            className="relative"
            topContent={{
              leftContent: PAGE_RENDERERS.getLeftContent(),
              rightContent: (
                <Button
                  onClick={closeDialog}
                  size="icon"
                  variant="secondary"
                  icon="cross"
                />
              )
            }}
            bottomContent={
              PAGE_RENDERERS.getBottomContent()
                ? { leftContent: PAGE_RENDERERS.getBottomContent() }
                : undefined
            }
          />
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {renderCurrentPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default SettingsModal

import Image from '@/components/ui/Image'

import {
  Breadcrumb as BreadcrumbWrapper,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbTextItem
} from '@/components/ui/breadcrumb'

import { Avatar } from '@/components/ui/avatar'
import { useUser } from '@/api/hooks/queries'
import { useSignOut } from '@/hooks/useSignOut'
import { getInitials } from '@/utils/user'
import MainSidebar from '@/components/layouts/Sidebar'
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import CreateOrganization from './Forms/CreateOrganization'
import { useCallback } from 'react'
import { useOnboardingStore } from '@/stores/OnboardingStore'
import { useCurrentOrganization } from '@/api/hooks/queries'

export default function OnboardingPage() {
  const { data } = useUser()
  const user = data?.user
  const { signOut: signOutHook } = useSignOut()

  const { data: currentOrganization } = useCurrentOrganization()
  const { orgName } = useOnboardingStore()
  const organizationName = orgName || currentOrganization?.name

  const handleSignOut = useCallback(() => {
    signOutHook()
  }, [signOutHook])
  return (
    <div className="flex h-screen bg-background p-[1rem]">
      {/* Left Side - Form */}
      <div className="flex w-[45%] flex-col gap-48 px-[5rem] pt-[4%]">
        <div>
          <Image
            src="/icons/agno.svg"
            alt="Agno"
            width={0}
            height={0}
            priority
            className="h-[2.875rem] w-[7.5rem]"
          />
        </div>
        {/* Forms Container */}
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col space-y-[1.5rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <Heading size={1} className="text-primary">
                Welcome to Agno
              </Heading>
              <Paragraph size="body" className="text-muted">
                Let's create an organization for your Agentic Systems
              </Paragraph>
            </div>
            <div className="flex flex-col gap-y-4">
              <CreateOrganization showSuccessToast={false} />

              <Paragraph size="body" className="text-muted/80">
                Wrong account?{' '}
                <span
                  className="cursor-pointer underline"
                  onClick={handleSignOut}
                  tabIndex={0}
                  role="button"
                >
                  Sign in with a different account.
                </span>
              </Paragraph>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - App Glimpse */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-background">
        {/* Bottom fade gradient */}
        <div className="Bottom-Gradient" />

        <div className="pointer-events-none absolute bottom-[10%] left-[10rem] flex h-[70%] w-full transform flex-col rounded-md rounded-b-none border border-b-0 border-border">
          <div className="flex items-center gap-[0.5rem] border-b border-border px-[0.5rem] py-[0.75rem]">
            <Avatar className="size-8">
              {user &&
                getInitials(user?.name || user?.username || user?.email || '')}
            </Avatar>
            <BreadcrumbWrapper>
              <BreadcrumbList>
                {organizationName && (
                  <BreadcrumbItem>
                    <BreadcrumbTextItem>{organizationName}</BreadcrumbTextItem>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </BreadcrumbWrapper>
          </div>
          <MainSidebar />
        </div>
      </div>
    </div>
  )
}

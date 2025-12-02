import React, { useEffect, useState } from 'react'
import { Tab2, Tab2List, Tab2Trigger } from '@/components/ui/tab2'
import { useRouter, useSearchParams } from '@/utils/navigation'
import { cn } from '@/utils/cn'
import Icon, { IconType } from '@/components/ui/icon'

const HeaderTabs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentTab, setCurrentTab] = useState('agent')

  useEffect(() => {
    const type = searchParams?.get('type') || 'agent'
    setCurrentTab(type)
  }, [searchParams])

  const handleTabChange = (value: string) => {
    // Update the lastType in the store when switching tabs
    const newSearchParams = new URLSearchParams(searchParams || '')
    newSearchParams.set('type', value)
    router.replace(`/sessions?${newSearchParams.toString()}`)
    setCurrentTab(value)
  }

  const tabs = [
    { value: 'agent', label: 'Agent', iconType: 'agent' },
    { value: 'team', label: 'Team', iconType: 'team' },
    { value: 'workflow', label: 'Workflow', iconType: 'workflow' }
  ]

  return (
    <Tab2
      value={currentTab}
      onValueChange={(value: string) => handleTabChange(value)}
    >
      <Tab2List>
        {tabs.map((tab) => (
          <Tab2Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex w-[144.33px] items-center gap-2 px-4 font-dmmono'
            )}
          >
            <Icon
              type={tab.iconType as IconType}
              size="xs"
              className={cn(
                'text-muted',
                currentTab === tab.value && 'text-primary'
              )}
            />
            {tab.label}
          </Tab2Trigger>
        ))}
      </Tab2List>
    </Tab2>
  )
}
export default HeaderTabs

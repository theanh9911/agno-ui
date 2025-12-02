import { Tab2, Tab2List, Tab2Trigger } from '@/components/ui/tab2'
import Icon, { type IconType } from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { useSearchParams } from 'react-router-dom'

export interface TabOption {
  value: string
  label: string
  icon?: IconType
  className?: string
}

interface SwitchTabProps {
  tabs: TabOption[]
  queryParamKey?: string
  defaultValue?: string
  className?: string
}

export const SwitchTab = ({
  tabs,
  queryParamKey = 'type',
  defaultValue,
  className = 'h-9 w-[218px]'
}: SwitchTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValue =
    searchParams.get(queryParamKey) || defaultValue || tabs[0]?.value || ''

  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams)

    newSearchParams.set(queryParamKey, value)
    setSearchParams(newSearchParams, { replace: true })
  }

  return (
    <div className="flex items-center gap-2">
      <Tab2
        value={currentValue}
        onValueChange={handleTabChange}
        className={className}
      >
        <Tab2List>
          {tabs.map((tab) => (
            <Tab2Trigger
              key={tab.value}
              className={tab.className}
              value={tab.value}
            >
              <div className="flex items-center gap-2">
                {tab.icon && (
                  <Icon type={tab.icon} size="xs" className="shrink-0" />
                )}
                <Paragraph size="label">{tab.label}</Paragraph>
              </div>
            </Tab2Trigger>
          ))}
        </Tab2List>
      </Tab2>
    </div>
  )
}

export default SwitchTab

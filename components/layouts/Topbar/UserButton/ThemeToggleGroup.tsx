import { FC } from 'react'
import { useTheme } from 'next-themes'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import Icon from '@/components/ui/icon/Icon'
import { type IconType } from '@/components/ui/icon/types'

type ThemeOption = {
  value: 'light' | 'dark' | 'system'
  icon: IconType
  label: string
}

const themeOptions: ThemeOption[] = [
  { value: 'light', icon: 'sun', label: 'Use light theme' },
  { value: 'dark', icon: 'moon', label: 'Use dark theme' },
  { value: 'system', icon: 'app-window', label: 'Use system theme' }
]

const ThemeToggleGroup: FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value) setTheme(value)
      }}
      className="w-full"
      aria-label="Select theme"
    >
      {themeOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          <Icon type={option.icon} size="xs" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default ThemeToggleGroup

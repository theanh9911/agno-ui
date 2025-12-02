import { useRef } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'

interface RefreshButtonProps {
  onClick: () => void
  label?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
  disabled?: boolean
  text?: string
}

const ANIMATION_CLASS = 'animate-[spin_0.5s_ease-in-out]'

export const RefreshButton = ({
  onClick,
  label = 'Reload',
  size = 'icon',
  variant = 'reload',
  className = '',
  disabled = false,
  text
}: RefreshButtonProps) => {
  const iconRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    iconRef.current?.classList.add(ANIMATION_CLASS)
    onClick?.()
  }

  const handleAnimationEnd = () => {
    iconRef.current?.classList.remove(ANIMATION_CLASS)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn('flex-shrink-0', className)}
      onClick={handleClick}
      aria-label={label}
    >
      <div ref={iconRef} onAnimationEnd={handleAnimationEnd}>
        <Icon type="reload" size="xs" />
      </div>
      {text && (
        <Paragraph className="text-primary" size="label">
          {text}
        </Paragraph>
      )}
    </Button>
  )
}

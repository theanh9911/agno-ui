import Icon from '@/components/ui/icon'
import { cn } from '@/utils/cn'

const Spinner = ({ className }: { className?: string }) => {
  return (
    <Icon
      type="loader-2"
      className={cn('animate-spin text-primary', className)}
      size="xs"
    />
  )
}

export default Spinner

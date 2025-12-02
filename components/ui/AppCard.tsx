import { ReactNode } from 'react'

interface AppCardProps {
  title: ReactNode
  description?: {
    content: ReactNode
    asChild?: boolean
  }
  footer?: ReactNode
}

const AppCard = ({ title, description, footer }: AppCardProps) => {
  const renderDescription = () => {
    if (!description) return null

    const { content, asChild = false } = description

    if (asChild) {
      return content
    }

    return (
      <div className="relative flex h-full items-center justify-between rounded-sm bg-background p-4">
        {content}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-secondary/50 p-1">
      <div className="flex p-2 uppercase text-primary">{title}</div>
      {renderDescription()}
      {footer && (
        <div className="flex p-2 uppercase text-primary">{footer}</div>
      )}
    </div>
  )
}

export default AppCard

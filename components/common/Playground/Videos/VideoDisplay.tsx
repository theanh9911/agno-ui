import { useState } from 'react'
import { cn } from '@/utils/cn'
import Icon from '@/components/ui/icon'

interface VideoDisplayProps {
  src: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
  onClick?: () => void
  showPlayButton?: boolean
}

/**
 * Reusable video display component
 */
const VideoDisplay = ({
  src,
  autoPlay = false,
  muted = false,
  controls = false,
  className,
  onClick,
  showPlayButton = false
}: VideoDisplayProps) => {
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-secondary/50 p-2 text-center text-muted',
          className || 'size-full'
        )}
      >
        <p className="text-xs text-primary">Video unavailable</p>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-md truncate text-xs text-primary underline"
          >
            {src}
          </a>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn('group relative size-full', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <video
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        preload="metadata"
        className={cn('rounded-lg', className || 'size-full')}
        onError={handleError}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/quicktime" />
      </video>

      {/* Play button overlay when showPlayButton is true */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xs bg-black/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30">
            <Icon type="play" size="xs" className="ml-1 text-black" />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoDisplay

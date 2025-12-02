import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ImageDisplayProps {
  src: string
  alt: string
  revisedPrompt?: string
  className?: string
  onClick?: () => void
}

/**
 * Reusable image display component
 */
const ImageDisplay = ({
  src,
  alt,
  revisedPrompt,
  className,
  onClick
}: ImageDisplayProps) => {
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
        <p className="text-xs text-primary">Image unavailable</p>
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
      className={cn(onClick && 'cursor-pointer', 'group relative size-full')}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'aspect-square rounded-lg object-contain',
          className || 'size-full'
        )}
        onError={handleError}
      />
      {revisedPrompt && (
        <div className="text-dmmono absolute inset-x-0 bottom-0 rounded-b-lg bg-secondary/80 p-2 font-dmmono text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {revisedPrompt}
        </div>
      )}
    </div>
  )
}

export default ImageDisplay

import { memo } from 'react'
import { type ImageData } from '@/types/Agent'
import { cn } from '@/utils/cn'
import { useDialog } from '@/providers/DialogProvider'
import { MediaPreviewDialogContent } from '../MediaPreviewDialogContent'
import { downloadMedia } from '@/utils/media'
import ImageDisplay from './ImageDisplay'

// if url is a string the its a normal image url else if its a object with content and mime_type then its a base64 image
// so return string url else convert the base64 image  into correct base64 url
const getImageSrc = (image: ImageData): string => {
  if (!image) return ''

  if (typeof image.url === 'string') {
    return image.url || ''
  }
  if ('content' in image) {
    const mime = image.mime_type ?? 'image/png'
    return `data:${mime};base64,${image.content}`
  }

  return ''
}

const Images = ({
  images,
  className,
  isPreview
}: {
  images: ImageData[]
  className?: string
  isPreview?: boolean
}) => {
  const { openDialog } = useDialog()

  return (
    <div className="flex flex-wrap gap-2">
      {images?.map((image, index) => {
        const src = getImageSrc(image)
        const urlObj = image
        const key =
          image?.id ??
          (typeof urlObj === 'string' ? urlObj : urlObj?.id) ??
          `image-${index}`

        const handleOpenDialog = () => {
          openDialog(
            <MediaPreviewDialogContent
              media={{
                type: 'image',
                data: image || {},
                src: src,
                copyText: src || '',
                onDownload: handleDownload
              }}
            />
          )
        }

        const handleDownload = () => {
          downloadMedia(src, 'image', image.mime_type)
        }

        return (
          <div
            key={key}
            className={cn('overflow-hidden rounded-lg', className)}
          >
            <ImageDisplay
              src={src}
              alt={image?.revised_prompt || 'AI generated image'}
              revisedPrompt={
                image?.revised_prompt && !isPreview
                  ? image.revised_prompt
                  : undefined
              }
              className={className}
              onClick={image ? handleOpenDialog : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
export default memo(Images)
Images.displayName = 'Images'

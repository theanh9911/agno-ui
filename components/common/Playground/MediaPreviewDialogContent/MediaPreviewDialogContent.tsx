import { Button } from '@/components/ui/button'
import { DialogContent } from '@/components/ui/dialog'
import { ImageData, VideoData } from '@/types/Agent'
import CopyButton from '@/components/common/CopyButton/CopyButton'
import ImageDisplay from '@/components/common/Playground/Images/ImageDisplay'
import VideoDisplay from '@/components/common/Playground/Videos/VideoDisplay'

type MediaPreviewData =
  | {
      type: 'image'
      data: ImageData
      src: string
      copyText?: string
      onDownload?: () => void
    }
  | {
      type: 'video'
      data: VideoData
      src: string
      onDownload?: () => void
      copyText?: string
    }

type MediaPreviewDialogContentProps = {
  media: MediaPreviewData
}

const MediaPreviewDialogContent = ({
  media
}: MediaPreviewDialogContentProps) => {
  return (
    <DialogContent
      className="max-h-[90vh] max-w-[90vw] items-center justify-center overflow-hidden md:max-w-[80vw] xl:max-w-[80vw]"
      showCloseButton
    >
      <div className="absolute right-10 top-1.5 z-50 flex">
        {media?.onDownload && (
          <Button
            size="icon"
            variant="ghost"
            onClick={media?.onDownload}
            icon="download"
            aria-label={`Download ${media?.type}`}
          />
        )}

        {media?.copyText && (
          <CopyButton
            content={media?.copyText || ''}
            showToast={true}
            className="flex size-9 items-center justify-center rounded-md hover:bg-primary/5"
          />
        )}
      </div>

      {media?.data && (
        <div className="group relative flex h-[calc(90vh-2rem)] w-fit items-center justify-center overflow-hidden p-8">
          {media?.type === 'video' ? (
            <VideoDisplay src={media?.src} autoPlay muted controls />
          ) : (
            <ImageDisplay
              src={media?.src}
              alt={media?.data?.revised_prompt || 'AI generated image'}
              revisedPrompt={media?.data?.revised_prompt}
            />
          )}
        </div>
      )}
    </DialogContent>
  )
}
export default MediaPreviewDialogContent

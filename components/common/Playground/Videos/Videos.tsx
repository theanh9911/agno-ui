import { memo } from 'react'
import { type VideoData } from '@/types/Agent'
import { useDialog } from '@/providers/DialogProvider'
import { MediaPreviewDialogContent } from '@/components/common/Playground/MediaPreviewDialogContent'
import { downloadMedia } from '@/utils/media'
import VideoDisplay from './VideoDisplay'

/**
 * Converts VideoData to a playable video source URL
 * Handles both base64 content and regular URLs
 */
const getVideoSrc = (video: VideoData): string => {
  if (!video) return ''

  if (video.content) {
    const mime = video.mime_type ?? 'video/mp4'
    return `data:${mime};base64,${video.content}`
  }

  if (video.url) {
    return video.url
  }

  return ''
}

/**
 * Individual video item component
 * Displays video thumbnail or full player based on showControls prop
 * Handles dialog opening and download functionality
 */
const VideoItem = memo(
  ({
    video,
    className,
    showControls
  }: {
    video: VideoData
    className?: string
    showControls?: boolean
  }) => {
    const videoSrc = getVideoSrc(video)
    const { openDialog } = useDialog()

    const handleOpenDialog = () => {
      openDialog(
        <MediaPreviewDialogContent
          media={{
            type: 'video',
            data: video || {},
            src: videoSrc,
            copyText: videoSrc,
            onDownload: handleDownload
          }}
        />
      )
    }

    const handleDownload = () => {
      downloadMedia(videoSrc, 'video', video.mime_type)
    }

    return (
      <VideoDisplay
        src={videoSrc}
        autoPlay={showControls}
        muted
        controls={showControls}
        className={className}
        onClick={video ? handleOpenDialog : undefined}
        showPlayButton={!showControls}
      />
    )
  }
)
VideoItem.displayName = 'VideoItem'

interface VideosProps {
  videos: VideoData[]
  className?: string
  showControls?: boolean
}

/**
 * Videos container component
 * Renders multiple video items in a flex layout
 */
const Videos = memo(({ videos, className, showControls }: VideosProps) => (
  <div className="flex flex-wrap gap-2">
    {videos.map((video) => (
      <VideoItem
        key={video.id}
        video={video}
        className={className}
        showControls={showControls}
      />
    ))}
  </div>
))
Videos.displayName = 'Videos'

export default Videos

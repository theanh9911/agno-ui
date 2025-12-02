import { memo } from 'react'
import Videos from '@/components/common/Playground/Videos'
import Images from '@/components/common/Playground/Images'
import Audios from '@/components/common/Playground/Audios'
import type { PlaygroundMessage, ResponseAudio } from '@/types/playground'
import type { IntermediateStep } from '@/types/playground'
import { AudioData, ImageData, VideoData } from '@/types/Agent'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import JsonRender from '@/components/ui/typography/JsonRenderer'
import { getJsonMarkdown } from '@/utils/playgroundUtils'

interface MessageContentRendererProps {
  content?: string | object
  videos?: Array<VideoData>
  images?: Array<ImageData>
  audio?: Array<AudioData>
  response_audio?: ResponseAudio
  // For PlaygroundMessage compatibility
  message?: PlaygroundMessage
  // For IntermediateStep compatibility
  chunk?: NonNullable<IntermediateStep['data']['originalChunk']>
}

const MessageContentRenderer = memo(
  ({
    content,
    videos,
    images,
    audio,
    response_audio,
    message,
    chunk
  }: MessageContentRendererProps) => {
    const messageContent = content || message?.content || chunk?.content
    const messageVideos = videos || message?.videos || chunk?.videos
    const messageImages = images || message?.images || chunk?.images
    const messageAudio = audio || message?.audio || chunk?.audio
    const messageAudios = message?.audios
    const messageResponseAudio =
      response_audio || message?.response_audio || chunk?.response_audio

    // Determine media className based on role
    const role = message?.role

    const hasStringContent =
      messageContent && typeof messageContent === 'string'
    // Check media existence and count total items
    const hasVideos = messageVideos && messageVideos.length > 0
    const hasImages = messageImages && messageImages.length > 0
    const hasAudio =
      (messageAudio && messageAudio.length > 0) ||
      (messageAudios && messageAudios.length > 0)

    const totalMediaCount =
      (messageVideos?.length || 0) +
      (messageImages?.length || 0) +
      (messageAudio?.length || 0) +
      (messageAudios?.length || 0)

    const multipleMedia = totalMediaCount > 1
    const previewStyle = 'w-[69px] h-[69px] rounded-xs'
    const mediaClassName =
      role === 'user'
        ? previewStyle
        : multipleMedia
          ? 'size-[268px]'
          : 'size-[480px]'

    let renderedContent

    // Only render the div wrapper if there's actual content to display
    if (hasStringContent || hasVideos || hasImages || hasAudio) {
      renderedContent = (
        <div className="flex w-full flex-col gap-3">
          {hasStringContent && (
            <MarkdownRenderer classname="text-primary/80">
              {messageContent}
            </MarkdownRenderer>
          )}

          <div className="flex gap-2">
            {/* Media Content */}
            {hasVideos && (
              <Videos
                videos={messageVideos}
                className={mediaClassName}
                showControls={role !== 'user'}
              />
            )}
            {hasImages && (
              <Images
                images={messageImages}
                className={mediaClassName}
                isPreview={multipleMedia}
              />
            )}
            {hasAudio && <Audios audio={messageAudio || messageAudios || []} />}
          </div>
        </div>
      )
    }
    if (typeof messageContent === 'object') {
      // Try rendering as markdown, fallback to JsonRender if error
      try {
        const jsonBlock = getJsonMarkdown(messageContent)
        renderedContent = (
          <div className="flex w-full flex-col gap-1">
            <MarkdownRenderer>{jsonBlock}</MarkdownRenderer>
          </div>
        )
      } catch {
        renderedContent = (
          <div className="flex w-full flex-col gap-1">
            <JsonRender content={messageContent} />
          </div>
        )
      }
    }
    // Handle response audio
    else if (messageResponseAudio) {
      const responseAudios = Array.isArray(messageResponseAudio)
        ? messageResponseAudio
        : [messageResponseAudio]
      renderedContent = responseAudios.map((audio) => (
        <div key={audio.id} className="flex w-full flex-col gap-4">
          <MarkdownRenderer>{audio?.transcript}</MarkdownRenderer>
          {audio?.content && audio && <Audios audio={[audio]} />}
        </div>
      ))
    }

    return <>{renderedContent}</>
  }
)

MessageContentRenderer.displayName = 'MessageContentRenderer'

export default MessageContentRenderer

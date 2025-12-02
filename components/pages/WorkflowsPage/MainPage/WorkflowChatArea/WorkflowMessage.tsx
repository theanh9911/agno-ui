import Icon from '@/components/ui/icon'

import { useUser } from '@/api/hooks/queries'
import MessageContentRenderer from '@/components/common/MessageContentRenderer/MessageContentRenderer'
import { WorkflowRealtimeEvent } from '@/types/workflow'
import WorkflowIntermediateSteps from '../WorkflowIntermediateSteps/WorkflowIntermediateSteps'
import { WorkflowParsedLabels } from '@/components/pages/WorkflowsPage/MainPage/WorkflowChatArea/WorkflowParsedLabels'
import { parseLabel } from '@/utils/playgroundUtils'
import DetailAction from '@/components/common/Playground/DetailAction'
import { AudioData, ImageData, VideoData } from '@/types/Agent'
import { ResponseAudio } from '@/types/playground'
import { useWorkflowById } from '@/hooks/workflows'

interface WorkflowAgentMessageProps {
  content?: string | object
  id: string
  events?: WorkflowRealtimeEvent[]
  isStreaming?: boolean
  images?: ImageData[]
  videos?: VideoData[]
  audio?: AudioData[]
  response_audio?: ResponseAudio
}
const inputClassName = 'mt-0.1 text-lg font-medium text-primary/80'

export const WorkflowAgentMessage = ({
  content,
  id,
  events,
  isStreaming,
  images,
  videos,
  audio,
  response_audio
}: WorkflowAgentMessageProps) => {
  return (
    <div key={id} id={`agent-message-${id}`} className="flex items-start gap-4">
      <div className="mt-0.5 shrink-0 rounded-sm bg-brand p-1 text-white">
        <Icon type="workflow" size="xs" className="text-white" />
      </div>
      <div className="flex w-full flex-col gap-2">
        {(events?.length ?? 0) > 0 && (
          <WorkflowIntermediateSteps
            events={events ?? []}
            isStreaming={isStreaming}
          />
        )}
        <MessageContentRenderer
          content={content ?? ''}
          images={images}
          videos={videos}
          audio={audio}
          response_audio={response_audio}
        />
        {!isStreaming && (
          <DetailAction copy content={content} className="pt-1" />
        )}
      </div>
    </div>
  )
}

export const WorkflowUserMessage = ({ message }: { message: string }) => {
  const { data } = useUser()
  const user = data?.user
  const parsedEntries = message ? parseLabel(message) : []
  const { data: workflow } = useWorkflowById()

  return (
    <div className="flex flex-row items-start gap-4 text-start max-md:break-words">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary text-[10px]">
        <div className="text-primary">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {parsedEntries?.length && workflow?.input_schema ? (
          <>
            <WorkflowParsedLabels message={message} />
          </>
        ) : (
          <div className={inputClassName}>
            {message?.replace(/^\s*{\s*/, '').replace(/\s*}\s*$/, '')}
          </div>
        )}
      </div>
    </div>
  )
}

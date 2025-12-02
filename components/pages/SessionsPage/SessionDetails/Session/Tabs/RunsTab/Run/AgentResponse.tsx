import Paragraph from '@/components/ui/typography/Paragraph'
import JsonRender from '@/components/ui/typography/JsonRenderer'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import Videos from '@/components/common/Playground/Videos'
import Images from '@/components/common/Playground/Images'
import Audios from '@/components/common/Playground/Audios'
import { Button } from '@/components/ui/button'
import DetailAction from '../../../../../../../common/Playground/DetailAction'
import { cn } from '@/utils/cn'
import { FormatType } from '@/components/pages/SessionsPage/types'
import { MAX_HEIGHT } from '../../../constants'
import React, { useRef, useState, useEffect } from 'react'
import { Run } from '../utils'

function stringifyContent(content: unknown): string {
  if (typeof content === 'string') return content
  try {
    return JSON.stringify(content, null, 2)
  } catch {
    return String(content)
  }
}

function agentContent(run: Run, viewMode: FormatType) {
  if (viewMode === FormatType.Text) {
    if (typeof run.content === 'string') {
      return (
        <Paragraph size="body" className="break-words">
          {run.content}
        </Paragraph>
      )
    }
    return <JsonRender content={run.content} />
  }

  if (run.run_response_format === 'json') {
    return <JsonRender content={run.content} />
  }

  const contentValue = stringifyContent(run.content)
  return <MarkdownRenderer>{contentValue}</MarkdownRenderer>
}

const AgentResponse = React.memo(function AgentResponse({
  run,
  viewMode
}: {
  run: Run
  viewMode: FormatType
}) {
  const responseRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldTruncate, setShouldTruncate] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const currentRef = responseRef.current
    if (currentRef) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.target && document.contains(entries[0].target)) {
          const contentHeightLocal = entries[0].target.scrollHeight
          setContentHeight(contentHeightLocal)
          setShouldTruncate(contentHeightLocal > MAX_HEIGHT)
        }
      })

      resizeObserver.observe(currentRef)
      return () => {
        resizeObserver.unobserve(currentRef)
        resizeObserver.disconnect()
      }
    }
  }, [run.content, viewMode])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const content = agentContent(run, viewMode)

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        style={{ maxHeight: isExpanded ? contentHeight : MAX_HEIGHT }}
        className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
      >
        <div ref={responseRef} className="flex flex-col gap-2">
          {content}
          {run.videos && run.videos?.length > 0 && (
            <Videos videos={run.videos} />
          )}
          {run.images && run.images?.length > 0 && (
            <Images images={run.images} />
          )}
          {run.audio && run.audio?.length > 0 && <Audios audio={run.audio} />}
          {run.response_audio?.transcript && (
            <div className="flex w-full flex-col gap-4">
              <MarkdownRenderer>
                {run.response_audio?.transcript}
              </MarkdownRenderer>
              {run.response_audio?.content && (
                <Audios audio={[run.response_audio]} />
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          'relative flex w-full items-center justify-start',
          shouldTruncate ? 'mt-2' : 'mb-2 mt-5'
        )}
      >
        {shouldTruncate && (
          <Button
            variant="ghost"
            onClick={toggleExpand}
            icon={isExpanded ? 'caret-up' : 'caret-down'}
            iconPosition="right"
            className="max-w-fit rounded-md font-dmmono text-xs uppercase text-primary"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
        <DetailAction
          copy
          content={run.content || run.response_audio?.transcript}
          className="absolute right-2"
        />
      </div>
    </div>
  )
})

export default AgentResponse

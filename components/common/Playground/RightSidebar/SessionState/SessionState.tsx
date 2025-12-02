import Code from '@/components/common/Code'
import Paragraph from '@/components/ui/typography/Paragraph'
import { useMemo } from 'react'

interface SessionStateProps {
  sessionState?: string | object
}

const SessionState = ({ sessionState }: SessionStateProps) => {
  const formattedSessionState = useMemo(() => {
    try {
      if (typeof sessionState === 'string') {
        return JSON.parse(sessionState)
      }
      return sessionState
    } catch {
      return sessionState
    }
  }, [sessionState])

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex min-h-[12rem] flex-col gap-y-2 overflow-auto">
        {sessionState && Object.keys(formattedSessionState || {}).length > 0 ? (
          <Code
            copyButton={true}
            useBackground={true}
            formatAsNestedObject={true}
          >
            {formattedSessionState}
          </Code>
        ) : (
          <div className="flex h-[20.5rem] flex-col items-center justify-center">
            <Paragraph className="text-muted">
              No session state available
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionState

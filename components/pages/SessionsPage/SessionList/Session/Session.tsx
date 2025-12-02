import React, { useEffect, useMemo, type FC } from 'react'
import Link from '@/components/ui/Link'
import { useParams, useSearchParams } from '@/utils/navigation'
import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { ROUTES } from '@/routes'
import { type DefaultPageParams } from '@/types/globals'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import { SessionList } from '@/types/Agent'
import { useSessionStore } from '@/stores/SessionsStore'
import { useFilterType } from '@/hooks/useFilterType'
import { formatSessionNameForDisplay } from '@/utils/sessionName'

interface RunRowLayoutPros {
  session: SessionList
}
const MemoizedSession: FC<RunRowLayoutPros> = ({ session }) => {
  const params = useParams<DefaultPageParams>()
  const { id } = params

  const setCurrentSession = useSessionStore((state) => state.setCurrentSession)

  const searchParams = useSearchParams()
  const { isTeam, isWorkflow } = useFilterType()
  const getSessionRoute = () => {
    const queryString = searchParams?.toString()
      ? `?${searchParams.toString()}`
      : ''

    return `${ROUTES.UserSessions}/${session.session_id}${queryString}`
  }
  const href = getSessionRoute()

  const determineIfActive = () => {
    return id === String(session.session_id)
  }

  const isActive = determineIfActive()
  const containerClass = cn(
    isActive && 'bg-secondary/50',
    'rounded-md hover:bg-secondary/50'
  )
  const displayName = useMemo(
    () =>
      session.session_name
        ? formatSessionNameForDisplay(session.session_name)
        : '-',
    [session.session_name]
  )
  useEffect(() => {
    if (isActive) {
      setCurrentSession({
        session_id: session.session_id,
        session_name: session.session_name ?? '',
        created_at: session?.created_at,
        updated_at: session?.updated_at
      })
    }
  }, [isActive, session, setCurrentSession])

  return (
    <div className={cn(containerClass)}>
      <Link
        href={href}
        onClick={() =>
          setCurrentSession({
            session_id: session.session_id,
            session_name: session.session_name ?? '',
            created_at: session?.created_at,
            updated_at: session?.updated_at
          })
        }
        className={cn(
          'group flex h-12 w-full items-center justify-between py-3',
          'px-2',
          containerClass
        )}
      >
        <div className="flex items-center gap-5 truncate">
          <div className="flex items-center gap-4">
            <Icon
              type={isTeam ? 'team' : isWorkflow ? 'workflow' : 'agent'}
              size="xs"
              className={cn(
                'flex-shrink-0 text-brand',
                !isActive && 'text-destructive/50 group-hover:opacity-100'
              )}
            />
          </div>
          <Paragraph size="body" className="block w-full truncate pr-6">
            {displayName}
          </Paragraph>
        </div>
        <Paragraph
          size="xsmall"
          className={cn('flex shrink-0 pr-4 text-right text-muted/50')}
        >
          {session.updated_at
            ? formatDate(session.updated_at, 'date-with-time')
            : formatDate(session.created_at, 'date-with-time')}
        </Paragraph>
      </Link>
    </div>
  )
}
const Session = React.memo(MemoizedSession)
Session.displayName = 'Session'
export default Session

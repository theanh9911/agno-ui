import React from 'react'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  MemoryBlankState,
  TeamMemoryBlankState
} from '@/components/pages/SessionsPage/BlankState/NotLoggedSession/NoLoggedSession'
import Link from '@/components/ui/Link'
import { useFilterType } from '@/hooks/useFilterType'
import { DOC_LINKS } from '@/docs'

const MemoriesBlankState = () => {
  const { isTeam, isWorkflow } = useFilterType()
  return (
    <div className="mt-4 flex w-full items-center justify-center rounded-md bg-secondary/50 py-9">
      <div className="flex h-full max-w-[14.75rem] flex-col items-center justify-center gap-6">
        {isTeam ? <TeamMemoryBlankState /> : <MemoryBlankState />}
        <div className="flex flex-col items-center gap-2">
          <Paragraph size="title" className="text-center text-primary">
            {` You do not have any memories yet.`}
          </Paragraph>
          <Paragraph size="body" className="text-center text-muted">
            {` Start chatting to your ${isTeam ? 'teams' : isWorkflow ? 'workflows' : 'agent'} and your memories will be logged here. `}
            <br />
            <Link
              target="_blank"
              href={DOC_LINKS.platform.memory.introduction}
              className="underline outline-none focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
            >
              Learn more.
            </Link>
          </Paragraph>
        </div>
      </div>
    </div>
  )
}
export default MemoriesBlankState

import { Button } from '@/components/ui/button'
import useChatActions from '@/hooks/playground/useChatActions'
import {
  useAgentsPlaygroundStore,
  usePlaygroundStore
} from '@/stores/playground'
import { useTeamsPlaygroundStore } from '@/stores/playground'
import { useCallback } from 'react'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { useWorkflowsStore } from '@/stores/workflowsStore'
import { useFilterType } from '../../../hooks/useFilterType'

const NewChatSessionButton = () => {
  const { messages } = useAgentsPlaygroundStore()
  const { chatInputRef } = usePlaygroundStore()
  const { isTeam, isWorkflow } = useFilterType()
  const teamMessages = useTeamsPlaygroundStore((state) => state.messages)
  const { clearChat } = useChatActions()
  const { session, setSession } = usePlaygroundQueries()
  const { setFormData } = useWorkflowsStore()

  const handleWorkflowNewSession = useCallback(() => {
    setSession(null)
    setFormData({})
    chatInputRef.current?.focus()
  }, [setSession, setFormData])

  const handleClick = () => {
    clearChat()
    chatInputRef.current?.focus()
  }

  const isDisabled = isWorkflow
    ? !session
    : isTeam
      ? teamMessages.length === 0
      : messages.length === 0

  return (
    <Button
      variant="default"
      onClick={isWorkflow ? handleWorkflowNewSession : handleClick}
      disabled={isDisabled}
      iconPosition="left"
      icon="plus"
      className="h-6 py-1"
    >
      New Session
    </Button>
  )
}

export default NewChatSessionButton

import React from 'react'
import AgentThinkingLoader from '../Playground/MessageAreaWrapper/AgentThinkingLoader'

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AgentThinkingLoader />
    </div>
  )
}

export default LoadingPage

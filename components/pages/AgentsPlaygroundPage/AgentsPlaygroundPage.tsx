import { ChatArea } from '@/components/common/Playground/ChatArea'
import { Helmet } from 'react-helmet-async'
import PlaygroundLayout from '@/components/layouts/PlaygroundLayout'

const AgentsPlaygroundPage = () => {
  return (
    <>
      <Helmet>
        <title>Agents Chat | Agno App</title>
      </Helmet>
      <PlaygroundLayout>
        <ChatArea />
      </PlaygroundLayout>
    </>
  )
}

export default AgentsPlaygroundPage

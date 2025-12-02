import MainPage from './MainPage'
import { Helmet } from 'react-helmet-async'
import PlaygroundLayout from '@/components/layouts/PlaygroundLayout'

const WorkflowsPage = () => {
  return (
    <>
      <Helmet>
        <title>Workflows | Agno OS</title>
      </Helmet>
      <PlaygroundLayout>
        <MainPage />
      </PlaygroundLayout>
    </>
  )
}

export default WorkflowsPage

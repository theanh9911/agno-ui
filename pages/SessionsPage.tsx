import { Routes, Route } from 'react-router-dom'
import SessionPageLayout from '@/components/pages/SessionsPage/SessionPage'
import SessionDetails from '@/components/pages/SessionsPage/SessionsDetails/SessionDetails'
import NotFoundPage from '@/pages/NotFoundPage'

const SessionDetailsPage = ({
  noSelectedPage = false
}: {
  noSelectedPage?: boolean
}) => {
  return (
    <SessionPageLayout>
      <SessionDetails noSelectedPage={noSelectedPage} />
    </SessionPageLayout>
  )
}

export default function SessionsPage() {
  return (
    <Routes>
      {/* New session routes */}

      <Route path=":id" element={<SessionDetailsPage />} />

      {/* Base sessions route - show blank state */}
      <Route index element={<SessionDetailsPage noSelectedPage />} />

      {/* 404 for invalid session paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

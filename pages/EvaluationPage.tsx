import EvaluationPage from '@/components/pages/EvaluationPage'
import NotFoundPage from '@/components/pages/NotFoundPage/NotFound'
import { Routes, Route } from 'react-router-dom'

export default function EvaluationPageWrapper() {
  return (
    <Routes>
      <Route index element={<EvaluationPage />} />
      <Route path=":id" element={<EvaluationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

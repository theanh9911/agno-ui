import KnowledgePage from '@/components/pages/KnowledgePage'
import { Routes, Route } from 'react-router-dom'

export default function KnowledgePageWrapper() {
  return (
    <Routes>
      <Route index element={<KnowledgePage />} />
      <Route path=":id" element={<KnowledgePage />} />
    </Routes>
  )
}

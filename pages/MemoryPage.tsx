import MemoryPage from '@/components/pages/MemoryPage'
import UserMemoryPage from '@/components/pages/MemoryPage/UserMemory/UserMemoryPage'
import { Routes, Route } from 'react-router-dom'

export default function MemoryPageWrapper() {
  return (
    <Routes>
      <Route index element={<UserMemoryPage />} />
      <Route path=":userId" element={<MemoryPage />} />
      <Route path=":userId/:memoryId" element={<MemoryPage />} />
    </Routes>
  )
}

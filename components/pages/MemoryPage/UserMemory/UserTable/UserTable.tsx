import { DataTable } from '@/components/common/DataTable'
import { useColumns } from './columns'
import { UserMemory } from '@/types/memory'
import { useRouter } from '@/utils/navigation'
import { useGetAllMemoryUsers } from '@/hooks/memory'

const UserTable = ({ isLoading }: { isLoading?: boolean }) => {
  const { data: userMemoriesResponse } = useGetAllMemoryUsers()
  const userMemories = userMemoriesResponse?.data || []
  const router = useRouter()
  const columns = useColumns()
  // User click handler
  const handleUserClick = (userId: string) => {
    const currentSearch = router?.search || ''
    router.push(`/memory/${userId}${currentSearch}`)
  }
  return (
    <DataTable
      columns={columns}
      data={userMemories}
      onRowClick={(row: UserMemory) => handleUserClick(row.user_id)}
      getItemId={(d: UserMemory) => d.user_id}
      isLoading={isLoading}
    />
  )
}

export default UserTable

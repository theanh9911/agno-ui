import { SortBy } from './filter'
import { Pagination } from './pagination'

export enum MemoryDialogModeType {
  CREATE = 'create',
  EDIT = 'edit'
}

export type SortByValue = `${SortBy}`

export type Memory = {
  memory_id: string
  memory: string
  topics: string[]
  updated_at: string
  agent_id: string | null
  team_id: string | null
  workflow_id: string | null
  user_id: string
}

export type Memories = Memory[]

export type MemoriesResponse = {
  data: Memories
  meta: Pagination
}

export type UserMemory = {
  user_id: string
  total_memories: number
  last_memory_updated_at: string
}
export type UserMemories = UserMemory[]

export type MemoriesUsersResponse = {
  data: UserMemories
  meta: Pagination
}

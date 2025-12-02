import { create } from 'zustand'
import { Pagination } from '@/types/pagination'

interface UsersPaginationState {
  page: number
  limit: number
  totalPages: number | null
}

interface PaginationState extends UsersPaginationState {
  totalCount: number | null
}

interface DatabasePaginationState {
  users: UsersPaginationState // Users list pagination
  userMemory: Record<string, PaginationState> // User memory pagination by userId
}

interface MemoryStore {
  // Single pagination state for everything
  pagination: Record<string, DatabasePaginationState>

  // User memory pagination methods
  setPageForUserMemory: (userId: string, page: number, dbId?: string) => void
  setLimitForUserMemory: (userId: string, limit: number, dbId?: string) => void
  setTotalPagesForUserMemory: (
    userId: string,
    totalPages: number | null,
    dbId?: string
  ) => void
  updatePaginationFromResponse: (
    userId: string,
    pagination: Pagination,
    dbId?: string
  ) => void
  getCurrentPagination: (userId: string, dbId?: string) => PaginationState

  // Users list pagination methods
  setUsersPage: (page: number, dbId?: string) => void
  setUsersLimit: (limit: number, dbId?: string) => void
  setUsersTotalPages: (totalPages: number | null, dbId?: string) => void
  updateUsersPaginationFromResponse: (
    pagination: UsersPaginationState,
    dbId?: string
  ) => void
  getCurrentUsersPagination: (dbId?: string) => UsersPaginationState

  // Selection state for memories
  selectedMemories: Set<string>
  setSelectedMemories: (selected: Set<string>) => void
  clearSelectedMemories: () => void
}

// Default pagination states
const DEFAULT_USER_MEMORY_PAGINATION: PaginationState = {
  page: 1,
  limit: 20,
  totalPages: null,
  totalCount: null
}
const DEFAULT_USERS_PAGINATION: UsersPaginationState = {
  page: 1,
  limit: 20,
  totalPages: null
}

export const useMemoryStore = create<MemoryStore>((set, get) => {
  // Helper functions
  const getDatabaseId = (dbId?: string) => dbId || 'default'

  const getDatabasePagination = (dbId: string): DatabasePaginationState => {
    const state = get()
    return (
      state.pagination[dbId] ?? {
        users: DEFAULT_USERS_PAGINATION,
        userMemory: {}
      }
    )
  }

  const updateUserMemoryPagination = (
    userId: string,
    updates: Partial<PaginationState>,
    dbId?: string
  ) => {
    const databaseId = getDatabaseId(dbId)
    const databasePagination = getDatabasePagination(databaseId)
    const currentUserPagination =
      databasePagination.userMemory[userId] ?? DEFAULT_USER_MEMORY_PAGINATION

    set((state) => ({
      pagination: {
        ...state.pagination,
        [databaseId]: {
          ...databasePagination,
          userMemory: {
            ...databasePagination.userMemory,
            [userId]: { ...currentUserPagination, ...updates }
          }
        }
      }
    }))
  }

  const updateUsersPagination = (
    updates: Partial<UsersPaginationState>,
    dbId?: string
  ) => {
    const databaseId = getDatabaseId(dbId)
    const databasePagination = getDatabasePagination(databaseId)
    const currentUsersPagination = databasePagination.users

    // Only update if values actually changed
    const hasChanges = Object.entries(updates).some(
      ([key, value]) =>
        currentUsersPagination[key as keyof UsersPaginationState] !== value
    )

    if (!hasChanges) return

    set((state) => ({
      pagination: {
        ...state.pagination,
        [databaseId]: {
          ...databasePagination,
          users: { ...currentUsersPagination, ...updates }
        }
      }
    }))
  }

  return {
    pagination: {},

    // User memory pagination methods
    setPageForUserMemory: (userId, page, dbId) =>
      updateUserMemoryPagination(userId, { page }, dbId),

    setLimitForUserMemory: (userId, limit, dbId) =>
      updateUserMemoryPagination(userId, { limit }, dbId),

    setTotalPagesForUserMemory: (userId, totalPages, dbId) =>
      updateUserMemoryPagination(userId, { totalPages }, dbId),

    updatePaginationFromResponse: (
      userId,
      { page = 1, limit, total_pages, total_count },
      dbId
    ) =>
      updateUserMemoryPagination(
        userId,
        {
          page,
          limit,
          totalPages: total_pages,
          totalCount: total_count
        },
        dbId
      ),

    getCurrentPagination: (userId: string, dbId?: string) => {
      if (!userId) return DEFAULT_USER_MEMORY_PAGINATION
      const databaseId = getDatabaseId(dbId)
      const databasePagination = getDatabasePagination(databaseId)
      return (
        databasePagination.userMemory[userId] ?? DEFAULT_USER_MEMORY_PAGINATION
      )
    },

    // Users list pagination methods
    setUsersPage: (page, dbId) => updateUsersPagination({ page }, dbId),
    setUsersLimit: (limit, dbId) => updateUsersPagination({ limit }, dbId),
    setUsersTotalPages: (totalPages, dbId) =>
      updateUsersPagination({ totalPages }, dbId),

    updateUsersPaginationFromResponse: (pagination, dbId) =>
      updateUsersPagination(
        {
          page: pagination.page || 1,
          limit: pagination.limit,
          totalPages: pagination.totalPages
        },
        dbId
      ),

    getCurrentUsersPagination: (dbId?: string) => {
      const databaseId = getDatabaseId(dbId)
      const databasePagination = getDatabasePagination(databaseId)
      return databasePagination.users
    },

    // Selection state for memories
    selectedMemories: new Set<string>(),
    setSelectedMemories: (selected) => set({ selectedMemories: selected }),
    clearSelectedMemories: () => set({ selectedMemories: new Set<string>() })
  }
})

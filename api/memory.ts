import { APIRoutes } from './routes'
import { request } from '@/utils/request'
import { QueryFilter } from '@/types/filter'

export const getMemories = async (options: QueryFilter) => {
  return request(APIRoutes.GetMemories(options.url), 'GET', {
    queryParam: {
      db_id: options.db_id ?? '',
      sort_by: options.sort_by ?? '',
      sort_order: options.sort_order ?? '',
      limit: options.limit,
      page: options.page,
      user_id: options.user_id ?? '',
      ...(options.table && { table: options.table })
    }
  })
}

export const getMemory = async (
  url: string,
  memoryId: string,
  dbId: string,
  table: string
) => {
  return request(APIRoutes.GetMemory(url, memoryId), 'GET', {
    queryParam: {
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

export const deleteMemory = async (
  url: string,
  memoryId: string,
  dbId: string,
  table: string
) => {
  return request(APIRoutes.DeleteMemory(url), 'DELETE', {
    body: {
      memory_ids: [memoryId]
    },
    queryParam: {
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

export const bulkDeleteMemories = async (
  url: string,
  memoryIds: string[],
  dbId: string,
  table: string
) => {
  return request(APIRoutes.DeleteMemory(url), 'DELETE', {
    body: {
      memory_ids: memoryIds
    },
    queryParam: {
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

// Combined function that handles both single and bulk deletion
export const deleteMemories = async (
  url: string,
  memoryIds: string[],
  dbId: string
) => {
  return request(APIRoutes.DeleteMemory(url), 'DELETE', {
    body: {
      memory_ids: memoryIds
    },
    queryParam: {
      db_id: dbId ?? ''
    }
  })
}

export type UpdateMemoryPayload = {
  memory?: string
  user_id?: string
  topics?: string[]
}

export const updateMemory = async (
  url: string,
  memoryId: string,
  payload: UpdateMemoryPayload,
  dbId: string,
  table: string
) => {
  return request(APIRoutes.UpdateMemory(url, memoryId), 'PATCH', {
    body: payload,
    queryParam: {
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

export type CreateMemoryPayload = {
  memory: string
  topics?: string[]
  user_id?: string
}

export const createMemory = async (
  url: string,
  payload: CreateMemoryPayload,
  dbId: string,
  table: string
) => {
  return request(APIRoutes.CreateMemory(url), 'POST', {
    body: payload,
    queryParam: {
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

export type GetAllMemoryUsersPayload = {
  limit: number
  page: number
}

export const getAllMemoryUsers = async (
  url: string,
  payload: GetAllMemoryUsersPayload,
  dbId: string,
  table: string
) => {
  return request(APIRoutes.GetAllMemoryUsers(url), 'GET', {
    queryParam: {
      limit: payload.limit,
      page: payload.page,
      db_id: dbId ?? '',
      ...(table && { table })
    }
  })
}

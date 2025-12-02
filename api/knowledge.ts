import { APIRoutes } from './routes'

import { request } from '@/utils/request'
import {
  DocumentStatus,
  KnowledgeConfigResponse,
  KnowledgeDocument,
  KnowledgeResponse,
  UploadDocumentPayload,
  EditDocumentPayload
} from '@/types/Knowledge'
import { QueryFilter } from '@/types/filter'

export const getDocuments = async (params: QueryFilter) => {
  return request<KnowledgeResponse>(APIRoutes.GetDocument(params.url), 'GET', {
    queryParam: {
      page: params.page,
      limit: params.limit,
      sort_by: params.sort_by ?? '',
      sort_order: params.sort_order ?? '',
      db_id: params.db_id,
      ...(params.table && { table: params.table })
    }
  })
}

export const getDocumentById = async (
  endpoint: string,
  db_id: string,
  documentId: string,
  table?: string
) => {
  return request<KnowledgeDocument>(
    APIRoutes.GetDocumentById(endpoint, documentId),
    'GET',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      }
    }
  )
}

export const uploadDocument = async (
  endpoint: string,
  db_id: string,
  payload: UploadDocumentPayload,
  table?: string
) => {
  const formData = new FormData()

  formData.append('name', payload.name ?? '')
  formData.append('description', payload.description ?? '')
  formData.append('url', payload.url ?? '')
  formData.append('metadata', payload.metadata ?? '')
  if (payload.file) {
    formData.append('file', payload.file)
  }
  if (payload.text_content) {
    formData.append('text_content', payload.text_content)
  }
  formData.append('reader_id', payload.reader_id ?? '')
  formData.append('chunker', payload.chunker ?? '')
  if (payload.chunk_size !== undefined && payload.chunk_size !== null) {
    formData.append('chunk_size', payload.chunk_size.toString())
  }
  if (payload.chunk_overlap !== undefined && payload.chunk_overlap !== null) {
    formData.append('chunk_overlap', payload.chunk_overlap.toString())
  }

  return request<KnowledgeDocument>(
    APIRoutes.UploadDocument(endpoint),
    'POST',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      },
      formData
    }
  )
}

export const editDocumentById = async (
  endpoint: string,
  db_id: string,
  documentId: string,
  payload: EditDocumentPayload,
  table?: string
) => {
  const formData = new FormData()

  formData.append('name', payload.name ?? '')
  formData.append('description', payload.description ?? '')
  formData.append('metadata', payload.metadata ?? '')
  formData.append('reader_id', payload.reader_id)

  return request<KnowledgeDocument>(
    APIRoutes.EditDocument(endpoint, documentId),
    'PATCH',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      },
      formData
    }
  )
}

export const deleteDocument = async (
  endpoint: string,
  db_id: string,
  documentId: string,
  table?: string
) => {
  return request<KnowledgeDocument>(
    APIRoutes.DeleteDocument(endpoint, documentId),
    'DELETE',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      }
    }
  )
}

export const deleteAllDocuments = async (
  endpoint: string,
  db_id: string,
  table?: string
) => {
  return request<KnowledgeDocument[]>(
    APIRoutes.DeleteAllDocuments(endpoint),
    'DELETE',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      }
    }
  )
}

export const getDocumentStatus = async (
  endpoint: string,
  db_id: string,
  documentId: string,
  table?: string
) => {
  return request<DocumentStatus>(
    APIRoutes.GetDocumentStatus(endpoint, documentId),
    'GET',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      }
    }
  )
}

export const getKnowledgeConfig = async (
  endpoint: string,
  db_id: string,
  table?: string
) => {
  return request<KnowledgeConfigResponse>(
    APIRoutes.GetKnowledgeConfig(endpoint),
    'GET',
    {
      queryParam: {
        db_id,
        ...(table && { table })
      }
    }
  )
}

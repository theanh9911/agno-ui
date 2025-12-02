import { Pagination } from './pagination'

export type EditDocumentPayload = {
  name?: string
  description?: string
  metadata?: string
  reader_id: string
}
export interface UploadDocumentPayload extends Partial<EditDocumentPayload> {
  url?: string
  file?: File | null | undefined | string
  text_content?: string | null
  chunker?: string
  chunk_size?: number | null
  chunk_overlap?: number | null
}

export interface ContentItem {
  file?: File
  url?: string
  type: 'file' | 'url'
  selected: boolean
  name: string
  description?: string
  metadata?: Record<string, string>
  reader_id?: string
  chunker?: string
  chunk_size?: number | null
  chunk_overlap?: number | null
}

export interface ContentItem2 {
  file?: File
  url?: string
  name: string
  description?: string
  metadata?: Record<string, string>
  reader_id?: string
  chunker?: string
}
export enum ContentType {
  FILE = 'file',
  WEB = 'web',
  TEXT = 'text'
}

export enum DocumentStatusEnums {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum DocumentTypeEnums {
  MANUAL = 'manual',
  URL = 'url',
  DEFAULT = 'default',
  TOPIC = 'topic'
}
export enum KnowledgePageMode {
  SELECTOR = 'selector',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  BULK_DELETE = 'bulk_delete',
  DELETE_ALL = 'delete_all'
}
export interface DocumentStatus {
  status: DocumentStatusEnums
  status_message: string
}

export interface KnowledgeDocument extends Partial<DocumentStatus> {
  id: string
  name: string
  description?: string
  type: string
  size: number
  linked_to?: string
  access_count?: number
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown>
}

export type KnowledgeResponse = {
  data: KnowledgeDocument[]
  meta: Pagination
}

export interface Chunker {
  key: string
  name: string
  description: string
  metadata: {
    chunk_size: number
    chunk_overlap: number
  }
}

export interface Reader {
  id: string
  name: string | null
  description: string | null
  chunkers: string[]
}

export interface KnowledgeConfigResponse {
  readers: Record<string, Reader>
  filters: string[]
  readersForType: Record<string, string[]>
  chunkers: Record<string, Chunker>
}

export enum FileTypeKey {
  TEXT = '.txt',
  URL = 'url',
  PDF = '.pdf',
  DOC = '.doc',
  DOCX = '.docx',
  CSV = '.csv',
  JSON = '.json',
  MD = '.md',
  TOPIC = 'topic',
  XLSX = '.xlsx',
  XLS = '.xls',
  YOUTUBE = 'youtube',
  PPTX = '.pptx'
}

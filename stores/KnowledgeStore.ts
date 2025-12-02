import { Pagination } from '@/types/pagination'
import { create } from 'zustand'
import {
  ContentType,
  KnowledgeDocument,
  KnowledgePageMode
} from '@/types/Knowledge'

interface KnowledgeState {
  page: number
  limit: number
  totalPages: number | null
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setTotalPages: (totalPages: number | null) => void
  updatePaginationFromResponse: (
    pagination: Omit<Pagination, 'total_count'>
  ) => void

  selectedDocuments: Set<string>
  setSelectedDocuments: (docs: Set<string>) => void
  clearSelectedDocuments: () => void

  // V1 KnowledgePage still uses this - can be removed when V1 is deprecated
  selectedDocument: KnowledgeDocument | null
  setSelectedDocument: (doc: KnowledgeDocument | null) => void

  // Content type state
  contentType: ContentType | null
  setContentType: (type: ContentType | null) => void

  ContentDialogMode: KnowledgePageMode | null
  setContentDialogMode: (mode: KnowledgePageMode | null) => void
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  page: 1,
  limit: 20,
  totalPages: null,
  setPage: (page) => {
    if (get().page !== page) {
      set({ page })
    }
  },
  setLimit: (limit) => {
    if (get().limit !== limit) {
      set({ limit })
    }
  },
  setTotalPages: (totalPages) => {
    if (get().totalPages !== totalPages) {
      set({ totalPages })
    }
  },
  updatePaginationFromResponse: (pagination) =>
    set({
      page: pagination.page || 1,
      limit: pagination.limit,
      totalPages: pagination.total_pages
    }),

  selectedDocuments: new Set<string>(),
  setSelectedDocuments: (docs: Set<string>) => set({ selectedDocuments: docs }),
  clearSelectedDocuments: () => set({ selectedDocuments: new Set() }),

  // V1 KnowledgePage still uses this - can be removed when V1 is deprecated
  selectedDocument: null,
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),

  contentType: null,
  setContentType: (type) => set({ contentType: type }),

  ContentDialogMode: null,
  setContentDialogMode: (mode) => set({ ContentDialogMode: mode })
}))

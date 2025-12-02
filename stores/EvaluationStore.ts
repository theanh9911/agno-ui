import { create } from 'zustand'

import { EvalRunData, PendingEvalRunData } from '@/types/evals'
import { Pagination } from '@/types/pagination'

interface PaginationState {
  page: number
  limit: number
  totalPages: number | null
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setTotalPages: (totalPages: number | null) => void
  totalCount: number | null
  setTotalCount: (totalCount: number | null) => void
  updatePaginationFromResponse: (pagination: Pagination) => void
  activeEvaluation: EvalRunData | null
  setActiveEvaluation: (evaluation: EvalRunData) => void
  selectedEvaluations: Set<string>
  setSelectedEvaluations: (selected: Set<string>) => void
  pendingEvaluations: PendingEvalRunData[]
  setPendingEvaluations: (pending: PendingEvalRunData[]) => void
}

export const useEvaluationStore = create<PaginationState>((set, get) => ({
  page: 1,
  limit: 30,
  totalPages: null,
  totalCount: null,

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
  setTotalCount: (totalCount) => {
    if (get().totalCount !== totalCount) {
      set({ totalCount })
    }
  },

  updatePaginationFromResponse: (pagination) =>
    set({
      page: pagination.page || 1,
      limit: pagination.limit,
      totalPages: pagination.total_pages,
      totalCount: pagination.total_count
    }),
  activeEvaluation: null,
  setActiveEvaluation: (evaluation) => {
    const current = get().activeEvaluation
    if (current?.id !== evaluation.id) {
      set({ activeEvaluation: evaluation })
    }
  },
  selectedEvaluations: new Set(),
  setSelectedEvaluations: (selected) => {
    const current = get().selectedEvaluations
    if (
      current.size !== selected.size ||
      [...current].some((id) => !selected.has(id)) ||
      [...selected].some((id) => !current.has(id))
    ) {
      set({ selectedEvaluations: selected })
    }
  },
  pendingEvaluations: [],
  setPendingEvaluations: (pending) => {
    set({ pendingEvaluations: pending })
  }
}))

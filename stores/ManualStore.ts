import { create } from 'zustand'

interface ManualStoreState {
  manualStatusBySession: Record<string, boolean>
  lastUpdatedAt?: number
  setManualStatus: (sessionId: string, isManual: boolean) => void
  bulkUpsert: (items: Array<{ sessionId: string; isManual: boolean }>) => void
  resetAll: () => void
}

export const useManualStore = create<ManualStoreState>((set) => ({
  manualStatusBySession: {},
  lastUpdatedAt: undefined,

  setManualStatus: (sessionId, isManual) =>
    set((state) => ({
      manualStatusBySession: {
        ...state.manualStatusBySession,
        [sessionId]: isManual
      },
      lastUpdatedAt: Date.now()
    })),

  bulkUpsert: (items) =>
    set((state) => {
      if (!items || items.length === 0) return state
      const next = { ...state.manualStatusBySession }
      let changed = false
      for (const { sessionId, isManual } of items) {
        if (sessionId && next[sessionId] !== isManual) {
          next[sessionId] = isManual
          changed = true
        }
      }
      if (!changed) return state
      return {
        manualStatusBySession: next,
        lastUpdatedAt: Date.now()
      }
    }),

  resetAll: () =>
    set((state) =>
      Object.keys(state.manualStatusBySession).length === 0
        ? state
        : { manualStatusBySession: {}, lastUpdatedAt: Date.now() }
    )
}))

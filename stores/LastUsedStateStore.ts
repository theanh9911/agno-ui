import { getLocalStorageKey } from '@/constants'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LastUsedState = {
  sessionSidebarWidth: string
  setSessionSidebarWidth: (width: string) => void
  sheetWidth: string
  setSheetWidth: (width: string) => void
  knowledgeTableWidth: string
  setKnowledgeTableWidth: (width: string) => void
  memoryTableWidth: string
  setMemoryTableWidth: (width: string) => void
  isPlaygroundSidebarCollapsed: boolean
  setIsPlaygroundSidebarCollapsed: (
    isPlaygroundSidebarCollapsed: boolean
  ) => void
  settingsPageLastVisitedPath: string | null
  setSettingsPageLastVisitedPath: (path: string) => void
  isWorkflowFormCollapsed: boolean
  setIsWorkflowFormCollapsed: (isWorkflowFormCollapsed: boolean) => void
}

export const useLastUsedStateStore = create<LastUsedState>()(
  persist(
    (set) => ({
      sessionSidebarWidth: '392px',
      setSessionSidebarWidth: (width: string) =>
        set({ sessionSidebarWidth: width }),
      sheetWidth: '400px',
      setSheetWidth: (width: string) => set({ sheetWidth: width }),
      knowledgeTableWidth: '923px',
      setKnowledgeTableWidth: (width: string) =>
        set({ knowledgeTableWidth: width }),
      memoryTableWidth: '923px',
      setMemoryTableWidth: (width: string) => set({ memoryTableWidth: width }),
      isPlaygroundSidebarCollapsed: false,
      setIsPlaygroundSidebarCollapsed: (
        isPlaygroundSidebarCollapsed: boolean
      ) => set({ isPlaygroundSidebarCollapsed }),
      settingsPageLastVisitedPath: null,
      setSettingsPageLastVisitedPath: (path: string) =>
        set({ settingsPageLastVisitedPath: path }),
      isWorkflowFormCollapsed: false,
      setIsWorkflowFormCollapsed: (isWorkflowFormCollapsed: boolean) =>
        set({ isWorkflowFormCollapsed })
    }),
    {
      name: getLocalStorageKey(`usersPreferences`),
      partialize: (state) => ({
        sessionSidebarWidth: state.sessionSidebarWidth,
        sheetWidth: state.sheetWidth,
        knowledgeTableWidth: state.knowledgeTableWidth,
        memoryTableWidth: state.memoryTableWidth,
        isPlaygroundSidebarCollapsed: state.isPlaygroundSidebarCollapsed,
        isWorkflowFormCollapsed: state.isWorkflowFormCollapsed
      })
    }
  )
)

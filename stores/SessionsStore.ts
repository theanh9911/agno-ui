import { FormatType, Tab } from '@/components/pages/SessionsPage/types'
import { SessionList } from '@/types/Agent'
import { create } from 'zustand'

interface SessionState {
  viewMode: FormatType | null
  isShowingDetails: boolean
  currentTab: Tab
  setViewMode: (mode: FormatType | null) => void
  setIsShowingDetails: (show: boolean) => void
  toggleDetails: () => void
  setCurrentTab: (tab: Tab) => void

  // Session selection
  currentSession: SessionList | null
  setCurrentSession: (session: SessionList | null) => void

  // Agent pagination
  agentPage: number
  setAgentPage: (newPage: number) => void

  // Team pagination
  teamPage: number
  setTeamPage: (newPage: number) => void

  // Workflow pagination
  workflowPage: number
  setWorkflowPage: (newPage: number) => void

  // Common settings
  pageSize: number
  setPageSize: (newPage: number) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  viewMode: null,
  isShowingDetails: false,
  currentTab: Tab.Run,
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsShowingDetails: (show) => set({ isShowingDetails: show }),
  toggleDetails: () =>
    set((state) => ({ isShowingDetails: !state.isShowingDetails })),
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Agent pagination
  agentPage: 1,
  setAgentPage: (agentPage) => set({ agentPage }),

  // Team pagination
  teamPage: 1,
  setTeamPage: (teamPage) => set({ teamPage }),

  // Workflow pagination
  workflowPage: 1,
  setWorkflowPage: (workflowPage) => set({ workflowPage }),

  // Session selection
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),

  // Common settings
  pageSize: 40,
  setPageSize: (pageSize) => set({ pageSize })
}))

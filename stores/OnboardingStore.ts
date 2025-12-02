import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getLocalStorageKey } from '@/constants'

interface OnboardingState {
  // Temporary form state (not persisted)
  orgName: string | null
  osName: string | null
  // Onboarding-specific state (persisted)
  hasCreatedOs: boolean
  setOrgName: (name: string | null) => void
  setOsName: (name: string | null) => void
  setHasCreatedOs: (created: boolean) => void
  reset: () => void
}

const initialState = {
  orgName: null,
  osName: null,
  hasCreatedOs: false
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setOrgName: (name) => set({ orgName: name }),
      setOsName: (name) => set({ osName: name }),
      setHasCreatedOs: (created) => set({ hasCreatedOs: created }),

      reset: () => set(initialState)
    }),
    {
      name: getLocalStorageKey('onboardingStore'),
      storage: createJSONStorage(() => localStorage),
      // Only persist onboarding-specific state, not temporary form values
      partialize: (state) => ({
        hasCreatedOs: state.hasCreatedOs
      })
    }
  )
)

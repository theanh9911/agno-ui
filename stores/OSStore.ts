import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getLocalStorageKey } from '@/constants'
import { OSResponse } from '@/api/generated'
import { OSCreateConnectDialogModeType } from '@/types/os'

export type OSAuthStatus =
  | 'loading'
  | 'authenticated'
  | 'auth-failed'
  | 'missing-security-key'

export interface CustomHeader {
  key: string
  value: string
}

interface OSState {
  currentOS: OSResponse | null
  setCurrentOS: (os: OSResponse | null) => void
  selectedOS: OSResponse | null
  setSelectedOS: (os: OSResponse | null) => void
  osBeingEdited: OSResponse | null
  setOSBeingEdited: (os: OSResponse | null) => void
  isOSCreateConnectDialogOpen: boolean
  osCreateConnectDialogMode: OSCreateConnectDialogModeType
  setOSCreateConnectDialogMode: (mode: OSCreateConnectDialogModeType) => void
  authStatus: OSAuthStatus
  setAuthStatus: (status: OSAuthStatus) => void
  openOSCreateConnectDialog: (
    mode: OSCreateConnectDialogModeType,
    os?: OSResponse
  ) => void
  closeOSCreateConnectDialog: () => void
  showSecurityKeyPopup: boolean
  setShowSecurityKeyPopup: (show: boolean) => void
  customHeaders: Record<string, CustomHeader[]>
  setCustomHeaders: (osId: string, headers: CustomHeader[]) => void
  getCustomHeaders: (osId: string) => CustomHeader[]
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      currentOS: null,
      setCurrentOS: (os: OSResponse | null) =>
        set((state) => ({
          currentOS: os,
          authStatus:
            state.currentOS?.id === os?.id ? state.authStatus : 'loading'
        })),
      selectedOS: null,
      setSelectedOS: (id: OSResponse | null) => set({ selectedOS: id }),
      osBeingEdited: null,
      setOSBeingEdited: (os: OSResponse | null) => set({ osBeingEdited: os }),
      authStatus: 'loading',
      setAuthStatus: (status: OSAuthStatus) => set({ authStatus: status }),
      isOSCreateConnectDialogOpen: false,
      osCreateConnectDialogMode: OSCreateConnectDialogModeType.USER_SELECTION,
      setOSCreateConnectDialogMode: (mode: OSCreateConnectDialogModeType) =>
        set({ osCreateConnectDialogMode: mode }),
      openOSCreateConnectDialog: (
        mode: OSCreateConnectDialogModeType,
        os?: OSResponse
      ) =>
        set({
          isOSCreateConnectDialogOpen: true,
          osCreateConnectDialogMode: mode,
          osBeingEdited:
            mode === OSCreateConnectDialogModeType.EDIT ? os || null : null
        }),
      closeOSCreateConnectDialog: () =>
        set({
          isOSCreateConnectDialogOpen: false,
          osBeingEdited: null
        }),
      showSecurityKeyPopup: false,
      setShowSecurityKeyPopup: (show: boolean) =>
        set({ showSecurityKeyPopup: show }),
      customHeaders: {},
      setCustomHeaders: (osId: string, headers: CustomHeader[]) =>
        set((state) => ({
          customHeaders: {
            ...state.customHeaders,
            [osId]: headers
          }
        })),
      getCustomHeaders: (osId: string) => {
        return get().customHeaders[osId] || []
      }
    }),
    {
      name: getLocalStorageKey(`OSStore`),
      partialize: (state) => ({
        currentOS: state.currentOS,
        customHeaders: state.customHeaders
      })
    }
  )
)

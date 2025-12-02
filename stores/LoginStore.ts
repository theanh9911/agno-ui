import { create } from 'zustand'

type AuthMethod = 'github' | 'google' | 'email' // Add your auth methods here

interface LoginStore {
  signingIn: AuthMethod | false
  setSigningIn: (method: AuthMethod | false) => void
}

export const useAuthStore = create<LoginStore>((set) => ({
  signingIn: false,
  setSigningIn: (method) => set({ signingIn: method })
}))

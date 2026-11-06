import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthResponse, AuthUser } from '@/types'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  hydrated: boolean
  setSession: (session: AuthResponse) => void
  updateUser: (user: AuthUser) => void
  setAccessToken: (accessToken: string) => void
  setHydrated: (hydrated: boolean) => void
  clearSession: () => void
}

// El access token vive solo en memoria; el refresh token viaja en una
// cookie HttpOnly que el frontend no puede leer.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hydrated: false,
      setSession: (session) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
        }),
      updateUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearSession: () =>
        set({ user: null, accessToken: null }),
    }),
    {
      name: 'empleo-rapido-auth',
      // Solo el usuario se persiste; nunca el access token.
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export const selectIsAuthenticated = (state: AuthState) =>
  Boolean(state.accessToken && state.user)

export const selectRole = (state: AuthState) => state.user?.role ?? null

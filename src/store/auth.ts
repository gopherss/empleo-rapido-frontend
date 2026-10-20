import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthResponse, AuthUser } from '@/types/api'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  hydrated: boolean
  setSession: (session: AuthResponse) => void
  updateUser: (user: AuthUser) => void
  setAccessToken: (accessToken: string) => void
  setHydrated: (hydrated: boolean) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setSession: (session) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      updateUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'empleo-rapido-auth',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export const selectIsAuthenticated = (state: AuthState) =>
  Boolean(state.accessToken && state.user)

export const selectRole = (state: AuthState) => state.user?.role ?? null

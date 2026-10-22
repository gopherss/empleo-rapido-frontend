import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

import { useAuthStore } from '@/store/auth'
import type { ApiError, AuthResponse } from '@/types'

export const API_URL = import.meta.env.VITE_API_URL ?? '/api'
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

export async function refreshSession(): Promise<string | null> {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) return null

  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  )
  useAuthStore.getState().setSession(data)
  return data.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined
    const status = error.response?.status
    const url = original?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/')

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true
      try {
        refreshPromise ??= refreshSession().finally(() => {
          refreshPromise = null
        })
        const token = await refreshPromise
        if (token) {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        }
      } catch {
        useAuthStore.getState().clearSession()
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined
    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message
    }
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor'
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Ocurrio un error inesperado'
}

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

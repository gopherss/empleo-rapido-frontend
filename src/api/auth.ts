import { api } from '@/lib/api'
import type { AuthResponse, AuthUser, Role } from '@/types'

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
  phone: string
  city: string
  latitude: number
  longitude: number
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}

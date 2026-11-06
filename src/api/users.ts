import { api } from '@/lib/api'
import type { AuthUser } from '@/types'

export interface UpdateUserPayload {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  city?: string
  address?: string
}

export interface UpdateLocationPayload {
  city?: string
  latitude: number
  longitude: number
}

export async function updateMe(payload: UpdateUserPayload): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>('/users/me', payload)
  return data
}

export async function updatePassword(
  password: string,
): Promise<{ success: boolean }> {
  const { data } = await api.patch<{ success: boolean }>(
    '/users/me/password',
    { password },
  )
  return data
}

export async function updateLocation(
  payload: UpdateLocationPayload,
): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>('/users/me/location', payload)
  return data
}

export async function uploadAvatar(file: File): Promise<AuthUser> {
  const form = new FormData()
  form.append('avatar', file)
  const { data } = await api.post<AuthUser>('/users/me/avatar', form)
  return data
}

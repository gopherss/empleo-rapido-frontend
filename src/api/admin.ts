import { api } from '@/lib/api'
import type {
  AdminJobsResponse,
  AdminStats,
  AdminUsersResponse,
} from '@/types/admin'
import type { JobStatus } from '@/types/job'

export interface AdminUsersParams {
  page?: number
  limit?: number
  query?: string
  role?: 'WORKER' | 'HOMEOWNER' | 'ADMIN'
}

export interface AdminJobsParams {
  page?: number
  limit?: number
  query?: string
  city?: string
  status?: JobStatus
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats')
  return data
}

export async function getAdminUsers(
  params: AdminUsersParams,
): Promise<AdminUsersResponse> {
  const { data } = await api.get<AdminUsersResponse>('/admin/users', { params })
  return data
}

export async function getAdminJobs(
  params: AdminJobsParams,
): Promise<AdminJobsResponse> {
  const { data } = await api.get<AdminJobsResponse>('/admin/jobs', { params })
  return data
}

export async function adminCancelJob(id: string): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>(`/admin/jobs/${id}/cancel`)
  return data
}

export async function adminSetUserStatus(
  id: string,
  isActive: boolean,
): Promise<{ id: string; isActive: boolean }> {
  const { data } = await api.patch(`/admin/users/${id}/status`, { isActive })
  return data
}

export async function adminDeleteUser(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data
}

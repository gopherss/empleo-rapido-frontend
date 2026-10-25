import { api } from '@/lib/api'
import type {
  Applicant,
  ApplicationStatus,
  MyApplication,
  Paginated,
} from '@/types'

export async function applyToJob(
  jobId: string,
  message?: string,
): Promise<Applicant> {
  const { data } = await api.post<Applicant>(`/jobs/${jobId}/applications`, {
    message,
  })
  return data
}

export async function listApplicants(jobId: string): Promise<Applicant[]> {
  const { data } = await api.get<Applicant[]>(`/jobs/${jobId}/applications`)
  return data
}

export interface ListMyApplicationsParams {
  status?: ApplicationStatus
  q?: string
  page?: number
  limit?: number
}

export async function listMyApplications(
  params: ListMyApplicationsParams = {},
): Promise<Paginated<MyApplication>> {
  const { data } = await api.get<Paginated<MyApplication>>(
    '/applications/my',
    { params },
  )
  return data
}

export async function getPendingApplicationsCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>(
    '/applications/pending-count',
  )
  return data.count
}

export async function withdrawApplication(
  id: string,
): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(
    `/applications/${id}`,
  )
  return data
}

export async function rejectApplication(
  id: string,
): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>(
    `/applications/${id}/reject`,
  )
  return data
}

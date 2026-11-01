import { api } from '@/lib/api'
import type {
  Currency,
  JobDetail,
  JobListItem,
  JobStatus,
  Paginated,
  WorkCategory,
} from '@/types'

export interface ListJobsParams {
  city?: string
  category?: WorkCategory
  q?: string
  latitude?: number
  longitude?: number
  sort?: 'distance' | 'recent'
  page?: number
  limit?: number
}

export interface ListMyJobsParams {
  status?: JobStatus
  page?: number
  limit?: number
}

export interface CreateJobPayload {
  title: string
  description: string
  category: WorkCategory
  city: string
  address?: string
  latitude: number
  longitude: number
  budget?: number
  currency?: Currency
  photos?: File[]
}

export interface UpdateJobPayload {
  title?: string
  description?: string
  category?: WorkCategory
  address?: string
  budget?: number
  photos?: File[]
}

function buildJobFormData(
  payload: CreateJobPayload | UpdateJobPayload,
): FormData {
  const form = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (key === 'photos') continue
    if (value === undefined || value === null || value === '') continue
    form.append(key, String(value))
  }
  for (const file of payload.photos ?? []) {
    form.append('photos', file)
  }
  return form
}

export async function listOpenJobs(
  params: ListJobsParams = {},
): Promise<Paginated<JobListItem>> {
  const { data } = await api.get<Paginated<JobListItem>>('/jobs', { params })
  return data
}

export async function getMyJobs(
  params: ListMyJobsParams = {},
): Promise<Paginated<JobListItem>> {
  const { data } = await api.get<Paginated<JobListItem>>('/jobs/my', {
    params,
  })
  return data
}

export async function getJob(id: string): Promise<JobDetail> {
  const { data } = await api.get<JobDetail>(`/jobs/${id}`)
  return data
}

export async function createJob(
  payload: CreateJobPayload,
): Promise<JobDetail> {
  const { data } = await api.post<JobDetail>('/jobs', buildJobFormData(payload))
  return data
}

export async function updateJob(
  id: string,
  payload: UpdateJobPayload,
): Promise<JobDetail> {
  const { data } = await api.patch<JobDetail>(
    `/jobs/${id}`,
    buildJobFormData(payload),
  )
  return data
}

export async function selectWorker(
  jobId: string,
  workerId: string,
): Promise<JobDetail> {
  const { data } = await api.post<JobDetail>(
    `/jobs/${jobId}/select/${workerId}`,
  )
  return data
}

export async function confirmAgreement(id: string): Promise<JobDetail> {
  const { data } = await api.post<JobDetail>(`/jobs/${id}/confirm-agreement`)
  return data
}

export async function releaseWorker(id: string): Promise<JobDetail> {
  const { data } = await api.post<JobDetail>(`/jobs/${id}/release`)
  return data
}

export async function cancelJob(id: string): Promise<JobDetail> {
  const { data } = await api.post<JobDetail>(`/jobs/${id}/cancel`)
  return data
}

export async function deleteJob(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/jobs/${id}`)
  return data
}

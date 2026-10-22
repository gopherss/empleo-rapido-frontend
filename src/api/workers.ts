import { api } from '@/lib/api'
import type {
  Currency,
  Review,
  WorkCategory,
  WorkerCv,
} from '@/types'

export interface UpdateWorkerCvPayload {
  headline?: string
  bio?: string
  categories?: WorkCategory[]
  skills?: string[]
  experienceYears?: number
  hourlyRate?: number
  currency?: Currency
  isAvailable?: boolean
}

export async function getMyCv(): Promise<WorkerCv> {
  const { data } = await api.get<WorkerCv>('/workers/me')
  return data
}

export async function updateMyCv(
  payload: UpdateWorkerCvPayload,
): Promise<WorkerCv> {
  const { data } = await api.patch<WorkerCv>('/workers/me', payload)
  return data
}

export async function getWorkerCv(id: string): Promise<WorkerCv> {
  const { data } = await api.get<WorkerCv>(`/workers/${id}`)
  return data
}

export async function getWorkerReviews(id: string): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/workers/${id}/reviews`)
  return data
}

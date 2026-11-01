import type { Currency, WorkCategory } from './common'
import type { ApplicationStatus } from './application-status'
import type { Review } from './review'

export const JOB_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: 'Disponible',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export interface JobContact {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  phone?: string | null
  distanceKm?: number | null
}

export interface JobListItem {
  id: string
  title: string
  description: string
  category: WorkCategory
  city: string
  address: string | null
  budget: string | number | null
  currency: Currency
  latitude: number
  longitude: number
  status: JobStatus
  photo: string | null
  photoCount: number
  distanceKm: number | null
  applicationCount: number
  pendingApplicationCount: number
  applied: boolean
  createdAt: string
}

export interface JobDetail extends JobListItem {
  photos: string[]
  homeowner: JobContact
  worker?: JobContact | null
  selectedAt?: string | null
  completedAt?: string | null
  agreementConfirmedAt?: string | null
  review?: Review | null
  homeownerReview?: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    author?: {
      id: string
      firstName: string
      lastName: string
      avatarUrl: string | null
    }
  } | null
  myApplicationStatus?: ApplicationStatus | null
}

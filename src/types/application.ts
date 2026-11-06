import type { ApplicationStatus } from './application-status'
import type { IdVerificationStatus } from './auth'
import type { WorkCategory } from './common'
import type { JobStatus } from './job'

export interface Applicant {
  applicationId: string
  status: ApplicationStatus
  idVerificationStatus: IdVerificationStatus
  message: string | null
  appliedAt: string
  workerId: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  phone: string | null
  city: string | null
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  averageRating: number
  completedJobs: number
  distanceKm: number | null
}

export interface MyApplication {
  id: string
  status: ApplicationStatus
  createdAt: string
  jobId: string
  jobTitle: string
  category: WorkCategory
  city: string
  jobStatus: JobStatus
}

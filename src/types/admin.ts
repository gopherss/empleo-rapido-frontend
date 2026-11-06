import type { IdVerificationStatus, Role } from './auth'
import type { Currency, WorkCategory } from './common'
import type { JobStatus } from './job'

export interface AdminStats {
  usersTotal: number
  workersTotal: number
  homeownersTotal: number
  jobsOpen: number
  jobsCompleted: number
  jobsCancelled: number
  applicationsPending: number
  notificationsTotal: number
}

export interface AdminListMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  city: string | null
  phone: string | null
  isActive: boolean
  idVerificationStatus: IdVerificationStatus
  jobsCount: number
  applicationsCount: number
  createdAt: string
}

export interface AdminUsersResponse {
  data: AdminUser[]
  meta: AdminListMeta
}

export interface AdminJob {
  id: string
  title: string
  category: WorkCategory
  city: string
  status: JobStatus
  budget: number | null
  currency: Currency
  createdAt: string
  homeowner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  worker: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
  applicationsCount: number
}

export interface AdminJobsResponse {
  data: AdminJob[]
  meta: AdminListMeta
}

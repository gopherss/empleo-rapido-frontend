import type { Currency, WorkCategory } from './common'

export interface WorkerProfile {
  id: string
  userId: string
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  hourlyRate: string | number | null
  currency: Currency
  isAvailable: boolean
  averageRating: number
  completedJobs: number
  createdAt: string
  updatedAt: string
}

export interface WorkerCv {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  city: string | null
  phone: string | null
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  hourlyRate: string | number | null
  currency: Currency
  isAvailable: boolean
  averageRating: number
  completedJobs: number
  reviews?: import('./review').Review[]
}

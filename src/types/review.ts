import type { WorkCategory } from './common'

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  photos: string[]
  workerId: string
  jobId: string
  author?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  } | null
  job?: {
    id: string
    title: string
    category: WorkCategory
    city: string
  } | null
}

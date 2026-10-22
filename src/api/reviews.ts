import { api } from '@/lib/api'
import type { Review } from '@/types'

export interface CreateReviewPayload {
  rating: number
  comment?: string
  photos: File[]
}

export async function createReview(
  jobId: string,
  payload: CreateReviewPayload,
): Promise<Review> {
  const form = new FormData()
  form.append('rating', String(payload.rating))
  if (payload.comment) form.append('comment', payload.comment)
  for (const file of payload.photos) {
    form.append('photos', file)
  }
  const { data } = await api.post<Review>(`/jobs/${jobId}/review`, form)
  return data
}

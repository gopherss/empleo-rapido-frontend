import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createHomeownerReview,
  createReview,
  type CreateHomeownerReviewPayload,
  type CreateReviewPayload,
} from '@/api/reviews'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string
      payload: CreateReviewPayload
    }) => createReview(jobId, payload),
    onSuccess: (_review, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.myCv })
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.all })
      toast.success('Trabajo finalizado y calificado')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useCreateHomeownerReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string
      payload: CreateHomeownerReviewPayload
    }) => createHomeownerReview(jobId, payload),
    onSuccess: (_review, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      toast.success('Gracias por calificar al dueno')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

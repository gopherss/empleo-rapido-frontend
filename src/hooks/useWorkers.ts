import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  getMyCv,
  getWorkerCv,
  getWorkerReviews,
  updateMyCv,
  type UpdateWorkerCvPayload,
} from '@/api/workers'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth'

export function useMyCv() {
  const role = useAuthStore((state) => state.user?.role)
  return useQuery({
    queryKey: queryKeys.workers.myCv,
    queryFn: getMyCv,
    enabled: role === 'WORKER',
  })
}

export function useUpdateMyCv() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateWorkerCvPayload) => updateMyCv(payload),
    onSuccess: (cv) => {
      queryClient.setQueryData(queryKeys.workers.myCv, cv)
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.all })
      toast.success('CV actualizado')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useWorkerCv(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workers.cv(id ?? ''),
    queryFn: () => getWorkerCv(id as string),
    enabled: Boolean(id),
  })
}

export function useWorkerReviews(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workers.reviews(id ?? ''),
    queryFn: () => getWorkerReviews(id as string),
    enabled: Boolean(id),
  })
}

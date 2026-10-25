import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  applyToJob,
  getPendingApplicationsCount,
  listApplicants,
  listMyApplications,
  rejectApplication,
  withdrawApplication,
  type ListMyApplicationsParams,
} from '@/api/applications'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useMyApplications(params: ListMyApplicationsParams) {
  return useQuery({
    queryKey: queryKeys.applications.mineList(params),
    queryFn: () => listMyApplications(params),
  })
}

/**
 * Total de postulaciones pendientes en las publicaciones del dueño.
 * Se refresca periodicamente para avisarle cuando un trabajador postula.
 */
export function usePendingApplicationsCount(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.applications.pendingCount,
    queryFn: getPendingApplicationsCount,
    enabled,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useApplicants(jobId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.applications.forJob(jobId ?? ''),
    queryFn: () => listApplicants(jobId as string),
    enabled: Boolean(jobId),
  })
}

export function useApplyToJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, message }: { jobId: string; message?: string }) =>
      applyToJob(jobId, message),
    onSuccess: (_application, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.mine })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      toast.success('Postulacion enviada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.mine })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      toast.success('Postulacion retirada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useRejectApplication(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.forJob(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      toast.success('Postulacion rechazada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

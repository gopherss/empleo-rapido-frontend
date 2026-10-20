import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  cancelJob,
  createJob,
  deleteJob,
  getJob,
  getMyJobs,
  listOpenJobs,
  selectWorker,
  updateJob,
  type CreateJobPayload,
  type ListJobsParams,
  type ListMyJobsParams,
  type UpdateJobPayload,
} from '@/api/jobs'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useOpenJobs(params: ListJobsParams) {
  return useQuery({
    queryKey: queryKeys.jobs.open(params),
    queryFn: () => listOpenJobs(params),
  })
}

export function useMyJobs(params: ListMyJobsParams) {
  return useQuery({
    queryKey: queryKeys.jobs.mineList(params),
    queryFn: () => getMyJobs(params),
  })
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id ?? ''),
    queryFn: () => getJob(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateJobPayload) => createJob(payload),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      toast.success('Publicacion creada')
      return job
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateJobPayload) => updateJob(id, payload),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.setQueryData(queryKeys.jobs.detail(id), job)
      toast.success('Publicacion actualizada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useSelectWorker(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (workerId: string) => selectWorker(jobId, workerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.forJob(jobId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      toast.success('Trabajador seleccionado')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useCancelJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelJob(id),
    onSuccess: (_job, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      toast.success('Publicacion cancelada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.pendingCount,
      })
      toast.success('Publicacion eliminada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

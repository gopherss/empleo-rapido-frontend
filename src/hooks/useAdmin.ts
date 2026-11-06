import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  adminCancelJob,
  adminDeleteUser,
  adminSetUserStatus,
  getAdminJobs,
  getAdminStats,
  getAdminUsers,
  type AdminJobsParams,
  type AdminUsersParams,
} from '@/api/admin'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: getAdminStats,
  })
}

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => getAdminUsers(params),
  })
}

export function useAdminJobs(params: AdminJobsParams) {
  return useQuery({
    queryKey: queryKeys.admin.jobs(params),
    queryFn: () => getAdminJobs(params),
  })
}

export function useAdminCancelJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => adminCancelJob(jobId),
    onSuccess: () => {
      toast.success('Publicacion cancelada')
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useAdminSetUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminSetUserStatus(id, isActive),
    onSuccess: (result) => {
      toast.success(result.isActive ? 'Usuario activado' : 'Usuario desactivado')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => {
      toast.success('Cuenta eliminada')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

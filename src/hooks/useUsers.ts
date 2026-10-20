import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  updateLocation,
  updateMe,
  uploadAvatar,
  type UpdateLocationPayload,
  type UpdateUserPayload,
} from '@/api/users'
import { getApiErrorMessage } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

export function useUpdateMe() {
  const updateUser = useAuthStore((state) => state.updateUser)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateMe(payload),
    onSuccess: (user) => {
      updateUser(user)
      queryClient.setQueryData(['me'], user)
      toast.success('Perfil actualizado')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUploadAvatar() {
  const updateUser = useAuthStore((state) => state.updateUser)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (user) => {
      updateUser(user)
      queryClient.setQueryData(['me'], user)
      toast.success('Foto de perfil actualizada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateLocation() {
  const updateUser = useAuthStore((state) => state.updateUser)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateLocationPayload) => updateLocation(payload),
    onSuccess: (user) => {
      updateUser(user)
      queryClient.setQueryData(['me'], user)
      toast.success('Ubicacion actualizada')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

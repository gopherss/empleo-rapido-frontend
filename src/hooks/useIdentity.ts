import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  fetchIdentityDocument,
  getIdentityStatus,
  submitIdentity,
  type IdentityDocumentKind,
  type SubmitIdentityPayload,
} from '@/api/identity'
import { getApiErrorMessage } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth'

export function useIdentityStatus() {
  return useQuery({
    queryKey: queryKeys.identity,
    queryFn: getIdentityStatus,
    staleTime: 30_000,
  })
}

export function useIdentityDocument(kind: IdentityDocumentKind, enabled: boolean) {
  return useQuery({
    queryKey: [...queryKeys.identity, 'document', kind],
    queryFn: () => fetchIdentityDocument(kind),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })
}

export function useSubmitIdentity() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMutation({
    mutationFn: (payload: SubmitIdentityPayload) => submitIdentity(payload),
    onSuccess: (status) => {
      queryClient.setQueryData(queryKeys.identity, status)
      if (user) {
        updateUser({ ...user, idVerificationStatus: status.status })
      }
      if (status.status === 'VERIFIED') {
        toast.success('Identidad verificada')
      } else if (status.status === 'REJECTED') {
        toast.error(status.note ?? 'No se pudo verificar la identidad')
      }
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

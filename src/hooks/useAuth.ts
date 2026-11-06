import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import {
  fetchMe,
  login,
  logout,
  register,
  type LoginPayload,
  type RegisterPayload,
} from '@/api/auth'
import { getApiErrorMessage, refreshSession } from '@/lib/api'
import { roleHome } from '@/lib/navigation'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth'

export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setSession(data)
      toast.success(`Bienvenido, ${data.user.firstName}`)
      navigate(roleHome(data.user.role), { replace: true })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      setSession(data)
      toast.success('Cuenta creada correctamente')
      navigate(roleHome(data.user.role), { replace: true })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      await logout().catch(() => undefined)
    },
    onSettled: () => {
      clearSession()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.accessToken && state.user),
  )
  const updateUser = useAuthStore((state) => state.updateUser)

  const query = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.data) {
      updateUser(query.data)
    }
  }, [query.data, updateUser])

  return query
}

export function useSessionBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    if (!hydrated) return
    // Al recargar el access token se pierde; si hay usuario persistido la
    // cookie HttpOnly debe devolver un access token nuevo.
    if (!user || accessToken) return

    let active = true
    refreshSession().catch(() => {
      if (active) clearSession()
    })

    return () => {
      active = false
    }
  }, [hydrated, user, accessToken, clearSession])
}

import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { PageLoader } from '@/components/common/Spinner'
import { roleHome } from '@/lib/navigation'
import { useAuthStore } from '@/store/auth'
import type { Role } from '@/types'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const hydrated = useAuthStore((state) => state.hydrated)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  if (!hydrated) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!accessToken && refreshToken) return <PageLoader label="Restaurando sesion..." />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  return <Outlet />
}

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[]
  children: ReactNode
}) {
  const user = useAuthStore((state) => state.user)
  if (user && !roles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />
  }
  return <>{children}</>
}


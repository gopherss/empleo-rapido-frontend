import { Navigate } from 'react-router-dom'

import { PageLoader } from '@/components/common/Spinner'
import { roleHome } from '@/lib/navigation'
import { useAuthStore } from '@/store/auth'

export function HomeRedirect() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const user = useAuthStore((state) => state.user)

  if (!hydrated) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={roleHome(user.role)} replace />
}

import { Briefcase } from 'lucide-react'
import { Link, Navigate, Outlet } from 'react-router-dom'

import { PageLoader } from '@/components/common/Spinner'
import { roleHome } from '@/lib/navigation'
import { useAuthStore } from '@/store/auth'

export function AuthLayout() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const user = useAuthStore((state) => state.user)

  if (!hydrated) return <PageLoader />
  if (user) return <Navigate to={roleHome(user.role)} replace />

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <Link to="/" className="mb-6 flex items-center gap-2 text-xl font-bold">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Briefcase className="size-5" />
        </span>
        EmpleoRapido
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

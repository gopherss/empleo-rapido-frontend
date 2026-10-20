import { MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAuthStore } from '@/store/auth'

export function LocationPrompt() {
  const user = useAuthStore((state) => state.user)
  const { request, isLoading } = useGeolocation()

  if (!user) return null
  if (user.latitude !== null && user.longitude !== null) return null

  return (
    <div className="border-b border-warning/30 bg-warning/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
        <MapPin className="size-4 text-warning" />
        <p className="flex-1">
          Activa tu ubicacion para ver los trabajos mas cercanos a ti.
        </p>
        <Button size="sm" onClick={() => request()} disabled={isLoading}>
          {isLoading ? 'Obteniendo...' : 'Usar mi ubicacion'}
        </Button>
      </div>
    </div>
  )
}

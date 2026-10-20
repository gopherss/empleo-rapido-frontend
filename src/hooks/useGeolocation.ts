import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useUpdateLocation } from '@/hooks/useUsers'
import { reverseGeocodeCity } from '@/lib/geocode'

type GeoStatus = 'idle' | 'loading' | 'success' | 'error'

export function useGeolocation() {
  const updateLocation = useUpdateLocation()
  const [status, setStatus] = useState<GeoStatus>('idle')

  const request = useCallback(
    async (onCity?: (city: string) => void) => {
      if (!('geolocation' in navigator)) {
        toast.error('Tu navegador no soporta geolocalizacion')
        setStatus('error')
        return
      }

      setStatus('loading')

      const position = await new Promise<GeolocationPosition | null>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            (value) => resolve(value),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
          )
        },
      )

      if (!position) {
        setStatus('error')
        toast.error('No pudimos obtener tu ubicacion')
        return
      }

      const { latitude, longitude } = position.coords
      const city = await reverseGeocodeCity(latitude, longitude)
      if (city) onCity?.(city)

      updateLocation.mutate(
        { latitude, longitude, city: city ?? undefined },
        {
          onSuccess: () => setStatus('success'),
          onError: () => setStatus('error'),
        },
      )
    },
    [updateLocation],
  )

  return {
    request,
    status,
    isLoading: status === 'loading' || updateLocation.isPending,
  }
}

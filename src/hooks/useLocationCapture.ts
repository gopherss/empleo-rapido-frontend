import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useUpdateLocation } from '@/hooks/useUsers'
import { reverseGeocodeCity } from '@/lib/geocode'

export interface LatLng {
  lat: number
  lng: number
}

interface UseLocationCaptureOptions {
  /** Persiste la ubicacion en el backend al capturarla (Ajustes). */
  persist?: boolean
  /** Coordenadas iniciales (por ejemplo, al editar un trabajo). */
  initialCoords?: LatLng | null
  onCity?: (city: string) => void
  onCoords?: (coords: LatLng) => void
  onError?: (message: string) => void
}

/**
 * Captura la ubicacion del navegador, deriva la ciudad por reverse geocoding
 * y expone el estado del proceso para los formularios.
 */
export function useLocationCapture({
  persist = false,
  initialCoords = null,
  onCity,
  onCoords,
  onError,
}: UseLocationCaptureOptions = {}) {
  const updateLocation = useUpdateLocation()
  const [coords, setCoords] = useState<LatLng | null>(initialCoords)
  const [locating, setLocating] = useState(false)

  const capture = useCallback(() => {
    if (!('geolocation' in navigator)) {
      toast.error('Tu navegador no soporta geolocalizacion')
      onError?.('Tu navegador no soporta geolocalizacion')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCoords(next)
        onCoords?.(next)

        const city = await reverseGeocodeCity(next.lat, next.lng)

        if (persist) {
          updateLocation.mutate(
            { latitude: next.lat, longitude: next.lng, city: city ?? undefined },
            {
              onSuccess: () => {
                if (city) onCity?.(city)
              },
            },
          )
        } else if (city) {
          onCity?.(city)
          toast.success('Ubicacion capturada')
        } else {
          onError?.('No pudimos obtener tu ciudad')
          toast.error('No pudimos obtener tu ciudad')
        }

        setLocating(false)
      },
      () => {
        setLocating(false)
        toast.error('No pudimos obtener tu ubicacion')
        onError?.('No pudimos obtener tu ubicacion')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [persist, onCity, onCoords, onError, updateLocation])

  return { coords, locating, capture }
}

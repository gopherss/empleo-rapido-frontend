/** Obtiene el nombre de la ciudad a partir de coordenadas (OpenStreetMap). */
export async function reverseGeocodeCity(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    zoom: '10',
    addressdetails: '1',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) return null

  const data = (await response.json()) as { address?: Record<string, string> }
  const address = data.address ?? {}

  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county ??
    address.state ??
    null
  )
}

export function getInitials(firstName?: string, lastName?: string): string {
  const a = firstName?.trim().charAt(0) ?? ''
  const b = lastName?.trim().charAt(0) ?? ''
  return (a + b).toUpperCase() || '?'
}

export function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined) return 'Distancia n/d'
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

import { CURRENCY_SYMBOLS, type Currency } from '@/types'

export function formatMoney(
  value: string | number | null | undefined,
  currency: Currency = 'PEN',
): string {
  if (value === null || value === undefined || value === '') return 'A convenir'
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return 'A convenir'
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  return `${symbol} ${num.toLocaleString('es-BO', { maximumFractionDigits: 0 })}`
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 30) return `Hace ${days} d`
  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

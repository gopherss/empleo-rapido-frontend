/**
 * Limites y validaciones del frontend, alineados con los DTOs del backend.
 * Se usan para dar feedback inmediato; el backend sigue siendo la fuente
 * de verdad.
 */

export const LIMITS = {
  name: 60,
  email: 254,
  passwordMin: 8,
  passwordMax: 72,
  phone: 20,
  city: 120,
  address: 200,
  dniMin: 5,
  dniMax: 12,
  jobTitle: 120,
  jobDescription: 3000,
  headline: 120,
  bio: 2000,
  skill: 40,
  applicationMessage: 500,
  reviewComment: 1000,
  search: 120,
  experienceYearsMax: 70,
  hourlyRateMax: 1000000,
} as const

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const DNI_REGEX = /^\d{5,12}$/
export const PHONE_REGEX = /^\+?[0-9\s()-]{6,20}$/

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function validateRequired(
  value: string,
  label: string,
  max?: number,
): string | null {
  const trimmed = value.trim()
  if (!trimmed) return `Ingresa ${label}`
  if (max && trimmed.length > max) return `Maximo ${max} caracteres`
  return null
}

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return 'Ingresa tu correo'
  if (email.length > LIMITS.email) return `Maximo ${LIMITS.email} caracteres`
  if (!EMAIL_REGEX.test(email)) return 'El correo no es valido'
  return null
}

export function validatePassword(
  value: string,
  options: { min?: number } = {},
): string | null {
  const min = options.min ?? LIMITS.passwordMin
  if (!value) return 'Ingresa tu contrasena'
  if (value.length < min) return `Minimo ${min} caracteres`
  if (value.length > LIMITS.passwordMax)
    return `Maximo ${LIMITS.passwordMax} caracteres`
  return null
}

export function validatePhone(
  value: string,
  options: { required?: boolean } = {},
): string | null {
  const phone = value.trim()
  if (!phone) return options.required ? 'Ingresa tu telefono' : null
  if (phone.length > LIMITS.phone) return `Maximo ${LIMITS.phone} caracteres`
  if (!PHONE_REGEX.test(phone)) return 'Ingresa un telefono valido'
  return null
}

export function validateDni(value: string): string | null {
  if (!value) return 'Ingresa tu DNI'
  if (!DNI_REGEX.test(value))
    return `El DNI debe tener entre ${LIMITS.dniMin} y ${LIMITS.dniMax} digitos`
  return null
}

/** Convierte el objeto de errores en un booleano (true = valido). */
export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some((value) => value !== null)
}

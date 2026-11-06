export const ROLES = ['WORKER', 'HOMEOWNER', 'ADMIN'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  WORKER: 'Trabajador',
  HOMEOWNER: 'Dueno de casa',
  ADMIN: 'Administrador',
}

export const ID_VERIFICATION_STATUSES = [
  'NONE',
  'PENDING',
  'VERIFIED',
  'REJECTED',
] as const
export type IdVerificationStatus = (typeof ID_VERIFICATION_STATUSES)[number]

export const ID_VERIFICATION_STATUS_LABELS: Record<
  IdVerificationStatus,
  string
> = {
  NONE: 'Sin verificar',
  PENDING: 'En verificacion',
  VERIFIED: 'Verificada',
  REJECTED: 'Rechazada',
}

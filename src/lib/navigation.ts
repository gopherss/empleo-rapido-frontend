import type { Role } from '@/types'

export function roleHome(role: Role | null | undefined): string {
  switch (role) {
    case 'HOMEOWNER':
      return '/my-jobs'
    case 'ADMIN':
      return '/admin'
    default:
      return '/jobs'
  }
}

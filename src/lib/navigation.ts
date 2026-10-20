import type { Role } from '@/types/api'

export function roleHome(role: Role | null | undefined): string {
  return role === 'HOMEOWNER' ? '/my-jobs' : '/jobs'
}

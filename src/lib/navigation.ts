import type { Role } from '@/types'

export function roleHome(role: Role | null | undefined): string {
  return role === 'HOMEOWNER' ? '/my-jobs' : '/jobs'
}

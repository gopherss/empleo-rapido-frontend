import { ShieldCheck } from 'lucide-react'

import type { IdVerificationStatus } from '@/types'

export function VerifiedBadge({
  status,
}: {
  status: IdVerificationStatus | undefined | null
}) {
  if (status !== 'VERIFIED') return null

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"
      title="Identidad verificada"
    >
      <ShieldCheck className="size-4" />
      Verificado
    </span>
  )
}

import type { JobStatus } from '@/types'
import { JOB_STATUS_LABELS } from '@/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<JobStatus, string> = {
  OPEN: 'bg-success/15 text-success border-success/30',
  IN_PROGRESS: 'bg-primary/15 text-primary border-primary/30',
  COMPLETED: 'bg-muted text-muted-foreground border-border',
  CANCELLED: 'bg-destructive/15 text-destructive border-destructive/30',
}

export function StatusBadge({
  status,
  className,
}: {
  status: JobStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  )
}

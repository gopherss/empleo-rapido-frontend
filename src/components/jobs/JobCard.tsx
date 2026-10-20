import { CheckCircle2, ImageIcon, MapPin, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { StatusBadge } from '@/components/common/StatusBadge'
import { resolveMediaUrl } from '@/lib/api'
import { formatDistance, formatMoney, formatRelativeDate } from '@/lib/format'
import { useAuthStore } from '@/store/auth'
import type { JobListItem } from '@/types/api'
import { CATEGORY_LABELS } from '@/types/api'

export function JobCard({ job }: { job: JobListItem }) {
  const photo = job.photo ? resolveMediaUrl(job.photo) : null
  const role = useAuthStore((state) => state.user?.role)
  const showPending = role === 'HOMEOWNER' && job.pendingApplicationCount > 0

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {photo ? (
          <img
            src={photo}
            alt={job.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={job.status} className="backdrop-blur" />
        </div>
        {job.applied && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
            <CheckCircle2 className="size-3.5" />
            Postulado
          </div>
        )}
        {showPending && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground shadow-sm">
            <UserPlus className="size-3.5" />
            {job.pendingApplicationCount} nuevo
            {job.pendingApplicationCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold leading-tight">
            {job.title}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-primary">
            {formatMoney(job.budget, job.currency)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {job.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.city}
            {job.distanceKm !== null && ` - ${formatDistance(job.distanceKm)}`}
          </span>
          {job.photoCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="size-3.5" />
              {job.photoCount}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {job.applicationCount}
          </span>
          <span className="ml-auto">{formatRelativeDate(job.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {CATEGORY_LABELS[job.category]}
          </span>
        </div>
      </div>
    </Link>
  )
}

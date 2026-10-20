import { Briefcase, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { RatingStars } from '@/components/common/RatingStars'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { resolveMediaUrl } from '@/lib/api'
import { formatDistance, getInitials } from '@/lib/format'
import type { Applicant } from '@/types/api'
import { CATEGORY_LABELS } from '@/types/api'

function whatsappLink(phone: string, jobTitle: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  const text = encodeURIComponent(
    `Hola! Te contacto por el trabajo "${jobTitle}" en EmpleoRapido.`,
  )
  return `https://wa.me/${digits}?text=${text}`
}

interface ApplicantCardProps {
  applicant: Applicant
  jobTitle: string
  onSelect?: (workerId: string) => void
  isSelecting?: boolean
  selectDisabled?: boolean
  isSelected?: boolean
}

export function ApplicantCard({
  applicant,
  jobTitle,
  onSelect,
  isSelecting,
  selectDisabled,
  isSelected,
}: ApplicantCardProps) {
  const avatar = applicant.avatarUrl
    ? resolveMediaUrl(applicant.avatarUrl)
    : null

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-muted-foreground">
          {avatar ? (
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            getInitials(applicant.firstName, applicant.lastName)
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/workers/${applicant.workerId}`}
                className="truncate font-semibold hover:text-primary hover:underline"
              >
                {applicant.firstName} {applicant.lastName}
              </Link>
              <p className="truncate text-sm text-muted-foreground">
                {applicant.headline ?? 'Trabajador de reparaciones'}
              </p>
            </div>
            <RatingStars
              value={applicant.averageRating}
              showValue
              className="shrink-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {applicant.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {applicant.city}
                {applicant.distanceKm !== null &&
                  ` - ${formatDistance(applicant.distanceKm)}`}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {applicant.completedJobs} trabajos
            </span>
            {applicant.experienceYears !== null && (
              <span>{applicant.experienceYears} anos de exp.</span>
            )}
          </div>

          {applicant.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {applicant.categories.slice(0, 4).map((category) => (
                <Badge key={category} variant="secondary">
                  {CATEGORY_LABELS[category]}
                </Badge>
              ))}
            </div>
          )}

          {applicant.skills.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Habilidades: </span>
              {applicant.skills.join(', ')}
            </p>
          )}

          {applicant.message && (
            <p className="rounded-md bg-muted/60 p-2 text-sm italic text-muted-foreground">
              "{applicant.message}"
            </p>
          )}
        </div>
      </div>

      {(onSelect || applicant.phone) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {applicant.phone && (
            <Button asChild variant="outline" size="sm">
              <a
                href={whatsappLink(applicant.phone, jobTitle)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          )}
          {onSelect &&
            (isSelected ? (
              <Badge variant="success" className="ml-auto">
                Seleccionado
              </Badge>
            ) : (
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => onSelect(applicant.workerId)}
                disabled={isSelecting || selectDisabled}
              >
                {isSelecting ? 'Seleccionando...' : 'Seleccionar'}
              </Button>
            ))}
        </div>
      )}
    </div>
  )
}

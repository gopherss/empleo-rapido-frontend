import { MapPin, Phone, Briefcase, Clock } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { PageLoader } from '@/components/common/Spinner'
import { RatingStars } from '@/components/common/RatingStars'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useWorkerCv, useWorkerReviews } from '@/hooks/useWorkers'
import { resolveMediaUrl } from '@/lib/api'
import { formatDate, formatMoney, getInitials } from '@/lib/format'
import { CATEGORY_LABELS } from '@/types/api'

export function WorkerPublicPage() {
  const { id } = useParams<{ id: string }>()
  const { data: cv, isLoading, isError } = useWorkerCv(id)
  const { data: reviews } = useWorkerReviews(id)

  if (isLoading) return <PageLoader />

  if (isError || !cv) {
    return (
      <p className="text-muted-foreground">No se encontro el perfil del trabajador.</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
          {cv.avatarUrl ? (
            <img
              src={resolveMediaUrl(cv.avatarUrl)}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            getInitials(cv.firstName, cv.lastName)
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold">
              {cv.firstName} {cv.lastName}
            </h1>
            <Badge variant={cv.isAvailable ? 'success' : 'secondary'}>
              {cv.isAvailable ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {cv.headline ?? 'Trabajador de reparaciones'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <RatingStars value={cv.averageRating} size="sm" showValue />
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-4" />
              {cv.completedJobs} trabajos completados
            </span>
            {cv.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {cv.city}
              </span>
            )}
            {cv.experienceYears !== null && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" />
                {cv.experienceYears} anos de experiencia
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {cv.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sobre mi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {cv.bio}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resenas recibidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="space-y-1.5 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <RatingStars value={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    {review.job && (
                      <p className="text-xs text-muted-foreground">
                        Trabajo: {review.job.title} ({review.job.city})
                      </p>
                    )}
                    {review.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {review.photos.map((photo) => (
                          <img
                            key={photo}
                            src={resolveMediaUrl(photo)}
                            alt="Trabajo terminado"
                            className="size-20 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Todavia no tiene resenas.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cv.categories.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {cv.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {CATEGORY_LABELS[category]}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin especialidades registradas.</p>
              )}
              {cv.skills.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Habilidades: </span>
                  {cv.skills.join(', ')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {cv.hourlyRate !== null && (
                <p>
                  Tarifa por hora:{' '}
                  <span className="font-medium text-foreground">
                    {formatMoney(cv.hourlyRate, cv.currency)}
                  </span>
                </p>
              )}
              {cv.phone && (
                <p className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" />
                  {cv.phone}
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

import { MapPin, Phone, Briefcase, Clock, Check, X, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useState } from 'react'

import { PageLoader } from '@/components/common/Spinner'
import { RatingStars } from '@/components/common/RatingStars'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAuthStore } from '@/store/auth'
import { resolveMediaUrl } from '@/lib/api'
import { formatDate, formatMoney, getInitials } from '@/lib/format'
import { useWorkerCv, useWorkerReviews } from '@/hooks/useWorkers'
import { useJob, useSelectWorker } from '@/hooks/useJobs'
import { useApplicants, useRejectApplication } from '@/hooks/useApplications'
import { CATEGORY_LABELS } from '@/types'

export function WorkerPublicPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: cv, isLoading, isError } = useWorkerCv(id)
  const { data: reviews } = useWorkerReviews(id)
  const [zoom, setZoom] = useState(false)

  const fromJobId = searchParams.get('fromJob') ?? undefined
  const { data: job } = useJob(fromJobId)
  const { data: applicants } = useApplicants(fromJobId)
  const selectWorker = useSelectWorker(fromJobId ?? '')
  const rejectApplication = useRejectApplication(fromJobId ?? '')

  const application = applicants?.find((a) => a.workerId === id)
  const canAct =
    Boolean(fromJobId && job && user && job.homeowner.id === user.id && job.status === 'OPEN' && application?.status === 'PENDING')

  const handleSelect = () => {
    if (!id) return
    selectWorker.mutate(id, { onSuccess: () => navigate(`/jobs/${fromJobId}`) })
  }

  const handleReject = () => {
    if (!application) return
    rejectApplication.mutate(application.applicationId, {
      onSuccess: () => navigate(`/jobs/${fromJobId}`),
    })
  }

  if (isLoading) return <PageLoader />

  if (isError || !cv) {
    return (
      <p className="text-muted-foreground">No se encontro el perfil del trabajador.</p>
    )
  }

  return (
    <div className="space-y-6">
      {fromJobId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/jobs/${fromJobId}`)}
          className="-ml-2"
        >
          <ArrowLeft />
          Volver al trabajo
        </Button>
      )}
      <div className="flex items-start gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
          {cv.avatarUrl ? (
            <img
              src={resolveMediaUrl(cv.avatarUrl)}
              alt=""
              className="size-full cursor-zoom-in object-cover"
              onClick={() => setZoom(true)}
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

          {canAct && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleSelect}
                disabled={selectWorker.isPending}
              >
                <Check />
                {selectWorker.isPending ? 'Seleccionando...' : 'Aceptar'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReject}
                disabled={rejectApplication.isPending}
              >
                <X />
                {rejectApplication.isPending ? 'Rechazando...' : 'Rechazar'}
              </Button>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-md p-2">
          {cv.avatarUrl && (
            <img
              src={resolveMediaUrl(cv.avatarUrl)}
              alt=""
              className="max-h-[80vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  ShieldAlert,
  Trash2,
  Users,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ApplicantCard } from '@/components/applications/ApplicantCard'
import { ApplyDialog } from '@/components/applications/ApplyDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { PhotoGallery } from '@/components/common/PhotoGallery'
import { RatingStars } from '@/components/common/RatingStars'
import { PageLoader } from '@/components/common/Spinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ReviewDialog } from '@/components/jobs/ReviewDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useApplicants } from '@/hooks/useApplications'
import { useCancelJob, useDeleteJob, useJob } from '@/hooks/useJobs'
import { formatDate, formatDistance, formatMoney } from '@/lib/format'
import { useAuthStore } from '@/store/auth'
import { APPLICATION_STATUS_LABELS, CATEGORY_LABELS } from '@/types'

function whatsappLink(phone: string, jobTitle: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  const text = encodeURIComponent(
    `Hola! Te contacto por el trabajo "${jobTitle}" en EmpleoRapido.`,
  )
  return `https://wa.me/${digits}?text=${text}`
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: job, isLoading, isError } = useJob(id)

  const isOwner = Boolean(job && user && job.homeowner.id === user.id)
  const isAssignedWorker = Boolean(job && user && job.worker?.id === user.id)
  const canSeeHomeownerContact = isOwner || isAssignedWorker
  const canManage = isOwner && job?.status === 'OPEN'

  const { data: applicants } = useApplicants(
    canManage ? job?.id : undefined,
  )
  const cancelJob = useCancelJob()
  const deleteJob = useDeleteJob()

  if (isLoading) return <PageLoader />
  if (isError || !job) {
    return (
      <EmptyState
        title="Publicacion no encontrada"
        action={
          <Button asChild variant="outline">
            <Link to="/">Volver al inicio</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (isOwner) {
            navigate('/my-jobs')
            return
          }
          navigate(-1)
        }}
        className="-ml-2"
      >
        <ArrowLeft />
        Volver
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              <Badge variant="secondary">{CATEGORY_LABELS[job.category]}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {job.city}
                {job.address && ` - ${job.address}`}
                {job.distanceKm !== null && ` (${formatDistance(job.distanceKm)})`}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" />
                {formatDate(job.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-4" />
                {job.applicationCount} postulantes
              </span>
            </div>
          </div>

          {job.photos.length > 0 && <PhotoGallery photos={job.photos} />}

          <Card>
            <CardHeader>
              <CardTitle>Descripcion</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-line text-sm text-muted-foreground">
              {job.description}
            </CardContent>
          </Card>

          {job.status === 'COMPLETED' && job.review && (
            <Card>
              <CardHeader>
                <CardTitle>Trabajo terminado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RatingStars
                  value={job.review.rating}
                  size="md"
                  showValue
                />
                {job.review.comment && (
                  <p className="text-sm text-muted-foreground">
                    {job.review.comment}
                  </p>
                )}
                {job.review.photos.length > 0 && (
                  <PhotoGallery photos={job.review.photos} />
                )}
              </CardContent>
            </Card>
          )}

          {canManage && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                Postulantes {applicants ? `(${applicants.length})` : ''}
              </h2>
              {applicants && applicants.length === 0 && (
                <EmptyState
                  title="Aun no hay postulantes"
                  description="Tu publicacion esta visible para los trabajadores de tu ciudad."
                />
              )}
              <div className="space-y-3">
                {applicants?.map((applicant) => (
                  <ApplicantCard
                    key={applicant.applicationId}
                    applicant={applicant}
                    jobTitle={job.title}
                    jobId={job.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatMoney(job.budget, job.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isOwner ? 'Publicado por ti' : 'Contacto'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium">
                {isOwner
                  ? `${user?.firstName} ${user?.lastName}`
                  : `${job.homeowner.firstName} ${job.homeowner.lastName}`}
              </p>
              {isOwner ? (
                <p className="text-muted-foreground">
                  Esta es tu publicacion.
                </p>
              ) : canSeeHomeownerContact && job.homeowner.phone ? (
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={whatsappLink(job.homeowner.phone, job.title)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle />
                    WhatsApp
                  </a>
                </Button>
              ) : user?.role === 'WORKER' ? (
                <p className="text-muted-foreground">
                  El contacto del dueno se mostrara automaticamente cuando
                  acepte tu postulacion.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Sin telefono registrado.
                </p>
              )}
            </CardContent>
          </Card>

          {job.worker && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Trabajador asignado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="font-medium">
                  {job.worker.firstName} {job.worker.lastName}
                </p>
                {isAssignedWorker ? (
                  <p className="text-muted-foreground">
                    Este trabajo esta asignado a ti.
                  </p>
                ) : job.worker.phone ? (
                  <Button asChild className="w-full">
                    <a
                      href={whatsappLink(job.worker.phone, job.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle />
                      WhatsApp
                    </a>
                  </Button>
                ) : (
                  <p className="inline-flex items-center gap-1 text-muted-foreground">
                    <Phone className="size-3.5" /> Sin telefono
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {isOwner && job.status === 'OPEN' && (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/my-jobs/${job.id}/edit`}>
                    <Pencil />
                    Editar publicacion
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive"
                  onClick={() =>
                    cancelJob.mutate(job.id, {
                      onSuccess: () => navigate('/my-jobs'),
                    })
                  }
                  disabled={cancelJob.isPending}
                >
                  Cancelar publicacion
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive"
                  onClick={() =>
                    deleteJob.mutate(job.id, {
                      onSuccess: () => navigate('/my-jobs'),
                    })
                  }
                  disabled={deleteJob.isPending}
                >
                  <Trash2 />
                  Eliminar
                </Button>
              </>
            )}

            {isOwner &&
              (job.status === 'IN_PROGRESS' || job.status === 'COMPLETED') && (
                <>
                  <Separator />
                  {job.status === 'IN_PROGRESS' ? (
                    <ReviewDialog
                      jobId={job.id}
                      trigger={
                        <Button className="w-full">
                          Finalizar y calificar
                        </Button>
                      }
                    />
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      Trabajo calificado
                    </p>
                  )}
                </>
              )}

            {user?.role === 'WORKER' && job.status === 'OPEN' && (
              <>
                {job.applied ? (
                  <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center text-sm">
                    <p className="font-medium text-success">
                      Ya te postulaste
                    </p>
                    {job.myApplicationStatus && (
                      <p className="text-muted-foreground">
                        Estado:{' '}
                        {APPLICATION_STATUS_LABELS[job.myApplicationStatus]}
                      </p>
                    )}
                  </div>
                ) : user.idVerificationStatus === 'VERIFIED' ? (
                  <ApplyDialog
                    jobId={job.id}
                    trigger={
                      <Button className="w-full">
                        Postularme (1 clic)
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                    <p className="inline-flex items-center gap-1.5 font-medium text-warning">
                      <ShieldAlert className="size-4" />
                      Verifica tu identidad
                    </p>
                    <p className="text-muted-foreground">
                      Necesitas completar la verificacion de identidad antes de
                      postularte. Puedes ver los trabajos, pero no postular.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/settings">Verificar ahora</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {isAssignedWorker && job.status === 'IN_PROGRESS' && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center text-sm font-medium text-primary">
                Este trabajo esta asignado a ti
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

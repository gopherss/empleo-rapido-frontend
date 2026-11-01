import { FileText, X, MessageCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { PageLoader } from '@/components/common/Spinner'
import { ApplicationFlow } from '@/components/applications/ApplicationFlow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useMyApplications,
  useWithdrawApplication,
} from '@/hooks/useApplications'
import { formatDate } from '@/lib/format'
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  CATEGORY_LABELS,
  type ApplicationStatus,
} from '@/types'

const statusVariant: Record<
  ApplicationStatus,
  'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
  WITHDRAWN: 'secondary',
}

type StatusFilter = ApplicationStatus | 'ALL' | 'COMPLETED'

const filters: StatusFilter[] = ['ALL', ...APPLICATION_STATUSES, 'COMPLETED']

const PAGE_SIZE = 10

export function MyApplicationsPage() {
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyApplications({
    status: status === 'ALL' || status === 'COMPLETED' ? undefined : status,
    q: q || undefined,
    page,
    limit: PAGE_SIZE,
  })
  const withdraw = useWithdrawApplication()

  const applications = (data?.data ?? []).filter((application) => {
    if (status === 'ACCEPTED') {
      return application.jobStatus === 'IN_PROGRESS'
    }
    if (status === 'COMPLETED') {
      return application.status === 'ACCEPTED' && application.jobStatus === 'COMPLETED'
    }
    return true
  })
  const hasFilters = status !== 'ALL' || q !== '' || status === 'COMPLETED' as StatusFilter

  const onSubmitSearch = (event: FormEvent) => {
    event.preventDefault()
    setQ(search.trim())
    setPage(1)
  }

  const clearSearch = () => {
    setSearch('')
    setQ('')
    setPage(1)
  }

  const goToPage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis postulaciones</h1>
        <p className="text-sm text-muted-foreground">
          Sigue el estado de los trabajos a los que te postulaste.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value as StatusFilter)
            setPage(1)
          }}
          className="min-w-0 sm:flex-1"
        >
          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="w-max">
              {filters.map((value) => (
                <TabsTrigger key={value} value={value}>
                  {value === 'ALL'
                    ? 'Todas'
                    : value === 'COMPLETED'
                      ? 'Finalizadas'
                      : APPLICATION_STATUS_LABELS[value]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <form
          onSubmit={onSubmitSearch}
          className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0"
        >
          <Input
            type="search"
            placeholder="Buscar por titulo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:w-56"
          />
          <Button type="submit" variant="outline">
            Buscar
          </Button>
          {q && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              aria-label="Limpiar busqueda"
            >
              <X />
            </Button>
          )}
        </form>
      </div>

      {isLoading && <PageLoader />}

      {data && applications.length === 0 && (
        <EmptyState
          icon={FileText}
          title={
            hasFilters
              ? 'No hay postulaciones con esos filtros'
              : 'Aun no te postulaste a ningun trabajo'
          }
          description={
            hasFilters
              ? 'Prueba con otro estado o termino de busqueda.'
              : 'Explora los trabajos disponibles y postulate en un clic.'
          }
          action={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('ALL')
                  clearSearch()
                }}
              >
                Limpiar filtros
              </Button>
            ) : (
              <Button asChild>
                <Link to="/jobs">Ver trabajos</Link>
              </Button>
            )
          }
        />
      )}

      <div className="space-y-3">
        {applications.map((application) => (
          <Card
            key={application.id}
            className="group relative transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <Link
              to={`/jobs/${application.jobId}`}
              aria-label={`Ver ${application.jobTitle}`}
              className="absolute inset-0 z-0 rounded-xl"
            />
            <CardContent className="pointer-events-none relative z-10 space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-semibold group-hover:text-primary group-hover:underline">
                    {application.jobTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[application.category]}
                    </Badge>
                    <span>{application.city}</span>
                    <span>Postulado el {formatDate(application.createdAt)}</span>
                  </div>
                </div>

                <Badge variant={statusVariant[application.status]}>
                  {APPLICATION_STATUS_LABELS[application.status]}
                </Badge>

                {application.status === 'PENDING' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="pointer-events-auto text-destructive"
                    onClick={() => withdraw.mutate(application.id)}
                    disabled={withdraw.isPending}
                  >
                    <X />
                    Retirar
                  </Button>
                )}
              </div>

              {application.status === 'ACCEPTED' && application.jobStatus === 'IN_PROGRESS' && (
                <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
                  <span className="relative">
                    <MessageCircle className="size-4" />
                    <span className="absolute -right-0.5 -top-0.5 flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    En negociacion por WhatsApp
                    <span className="ml-1 inline-flex">
                      <span className="animate-[pulse_1.4s_ease-in-out_infinite]">.</span>
                      <span className="animate-[pulse_1.4s_ease-in-out_infinite] [animation-delay:200ms]">.</span>
                      <span className="animate-[pulse_1.4s_ease-in-out_infinite] [animation-delay:400ms]">.</span>
                    </span>
                  </span>
                </div>
              )}

              <ApplicationFlow
                status={application.status}
                jobStatus={application.jobStatus}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {data && (
        <Pagination
          page={data.meta.page}
          pages={data.meta.pages}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}

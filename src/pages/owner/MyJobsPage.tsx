import { Plus, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { PageLoader } from '@/components/common/Spinner'
import { JobCard } from '@/components/jobs/JobCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMyJobs } from '@/hooks/useJobs'
import { useAuthStore } from '@/store/auth'
import { JOB_STATUS_LABELS, type JobStatus } from '@/types/api'

const filters: (JobStatus | 'ALL')[] = [
  'ALL',
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]

const PAGE_SIZE = 10

export function MyJobsPage() {
  const [filter, setFilter] = useState<JobStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const user = useAuthStore((state) => state.user)
  const isVerified = user?.idVerificationStatus === 'VERIFIED'

  const params = useMemo(
    () => ({
      status: filter === 'ALL' ? undefined : filter,
      page,
      limit: PAGE_SIZE,
    }),
    [filter, page],
  )

  const { data, isLoading } = useMyJobs(params)

  const jobs = data?.data ?? []

  const goToPage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mis publicaciones</h1>
          <p className="text-sm text-muted-foreground">
            Administra los trabajos que publicaste.
          </p>
        </div>
        <Button asChild variant={isVerified ? 'default' : 'outline'}>
          <Link to={isVerified ? '/my-jobs/new' : '/settings'}>
            {isVerified ? <Plus /> : <ShieldAlert />}
            {isVerified ? 'Publicar trabajo' : 'Verificar para publicar'}
          </Link>
        </Button>
      </div>

      {!isVerified && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          <p className="inline-flex items-center gap-1.5 font-medium text-warning">
            <ShieldAlert className="size-4" />
            Verifica tu identidad para publicar
          </p>
          <p className="mt-1 text-muted-foreground">
            Necesitas completar la verificacion de identidad antes de publicar
            un trabajo.
          </p>
        </div>
      )}

      <Tabs
        value={filter}
        onValueChange={(value) => {
          setFilter(value as JobStatus | 'ALL')
          setPage(1)
        }}
      >
        <TabsList className="flex-wrap">
          {filters.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === 'ALL' ? 'Todas' : JOB_STATUS_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <PageLoader />}

      {data && jobs.length === 0 && (
        <EmptyState
          title="No hay publicaciones aqui"
          description="Publica un trabajo para recibir postulaciones de trabajadores cercanos."
          action={
            <Button asChild>
              <Link to={isVerified ? '/my-jobs/new' : '/settings'}>
                {isVerified ? 'Publicar trabajo' : 'Verificar identidad'}
              </Link>
            </Button>
          }
        />
      )}

      {jobs.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {data && (
            <Pagination
              page={data.meta.page}
              pages={data.meta.pages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  )
}

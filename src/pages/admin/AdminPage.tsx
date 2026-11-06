import { Ban, PowerOff, RefreshCw, Search, ShieldCheck, Trash2, Users, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PageLoader } from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useAdminCancelJob,
  useAdminDeleteUser,
  useAdminJobs,
  useAdminSetUserStatus,
  useAdminStats,
  useAdminUsers,
} from '@/hooks/useAdmin'
import { formatDate, formatMoney } from '@/lib/format'
import {
  CATEGORY_LABELS,
  ID_VERIFICATION_STATUS_LABELS,
  JOB_STATUS_LABELS,
  ROLE_LABELS,
} from '@/types'

const PAGE_SIZE = 10

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { data: stats } = useAdminStats()

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Sin datos.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Usuarios totales" value={stats.usersTotal} icon={<Users className="size-5" />} />
      <StatCard label="Trabajadores" value={stats.workersTotal} icon={<Wrench className="size-5" />} />
      <StatCard label="Duenos de casa" value={stats.homeownersTotal} icon={<Users className="size-5" />} />
      <StatCard label="Postulaciones pendientes" value={stats.applicationsPending} icon={<Users className="size-5" />} />
      <StatCard label="Publicaciones abiertas" value={stats.jobsOpen} icon={<Wrench className="size-5" />} />
      <StatCard label="Trabajos completados" value={stats.jobsCompleted} icon={<ShieldCheck className="size-5" />} />
      <StatCard label="Publicaciones canceladas" value={stats.jobsCancelled} icon={<Ban className="size-5" />} />
      <StatCard label="Notificaciones enviadas" value={stats.notificationsTotal} icon={<ShieldCheck className="size-5" />} />
    </div>
  )
}

function AdminUsersSection() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const setStatus = useAdminSetUserStatus()
  const deleteUser = useAdminDeleteUser()

  const params = useMemo(
    () => ({ page, limit: PAGE_SIZE, query: search || undefined }),
    [page, search],
  )
  const { data, isLoading } = useAdminUsers(params)

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Eliminar la cuenta de ${name}? Se borraran sus publicaciones, postulaciones y reseñas. Esta accion no se puede deshacer.`)) {
      return
    }
    deleteUser.mutate(id)
  }

  return (
    <div className="space-y-3">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          setPage(1)
          setSearch(query)
        }}
      >
        <Input
          placeholder="Buscar por nombre o email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Buscar">
          <Search />
        </Button>
      </form>

      {isLoading ? (
        <PageLoader />
      ) : (data?.data?.length ?? 0) === 0 ? (
        <EmptyState title="Sin usuarios" description="No se encontraron usuarios." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-4 py-2 font-medium">Usuario</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium">Identidad</th>
                <th className="px-4 py-2 font-medium">Actividad</th>
                <th className="px-4 py-2 font-medium">Registrado</th>
                <th className="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-2">{ROLE_LABELS[user.role]}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        user.isActive
                          ? 'inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success'
                          : 'inline-flex items-center rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive'
                      }
                    >
                      {user.isActive ? 'Activo' : 'Desactivado'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {ID_VERIFICATION_STATUS_LABELS[user.idVerificationStatus]}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {user.jobsCount} pub. - {user.applicationsCount} post.
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title={user.isActive ? 'Desactivar cuenta' : 'Activar cuenta'}
                        disabled={setStatus.isPending}
                        onClick={() =>
                          setStatus.mutate({ id: user.id, isActive: !user.isActive })
                        }
                      >
                        {user.isActive ? <PowerOff /> : <RefreshCw />}
                        {user.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        title="Eliminar cuenta"
                        disabled={deleteUser.isPending}
                        onClick={() =>
                          handleDelete(user.id, `${user.firstName} ${user.lastName}`)
                        }
                      >
                        <Trash2 />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={data?.meta.page ?? 1}
        pages={data?.meta.pages ?? 1}
        onPageChange={setPage}
      />
    </div>
  )
}

function AdminJobsSection() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const cancelJob = useAdminCancelJob()

  const params = useMemo(
    () => ({ page, limit: PAGE_SIZE, query: search || undefined }),
    [page, search],
  )
  const { data, isLoading } = useAdminJobs(params)

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setPage(1)
    setSearch(query)
  }

  return (
    <div className="space-y-3">
      <form className="flex gap-2" onSubmit={handleSearch}>
        <Input
          placeholder="Buscar por titulo"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Buscar">
          <Search />
        </Button>
      </form>

      {isLoading ? (
        <PageLoader />
      ) : (data?.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="Sin publicaciones"
          description="No se encontraron publicaciones."
        />
      ) : (
        <div className="space-y-2">
          {data?.data.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{job.title}</p>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[job.category]} - {job.city} {job.budget !== null ? `- ${formatMoney(job.budget, job.currency)}` : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  Dueno: {job.homeowner.firstName} {job.homeowner.lastName}
                  {job.worker ? ` - Trabajador: ${job.worker.firstName} ${job.worker.lastName}` : ''} - {job.applicationsCount} postulaciones - {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:self-end">
                <span className="text-xs text-muted-foreground">
                  {JOB_STATUS_LABELS[job.status]}
                </span>
                {job.status !== 'CANCELLED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={cancelJob.isPending}
                    onClick={() => cancelJob.mutate(job.id)}
                  >
                    <Ban />
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={data?.meta.page ?? 1}
        pages={data?.meta.pages ?? 1}
        onPageChange={setPage}
      />
    </div>
  )
}

export function AdminPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Panel de administracion</h1>
        <p className="text-sm text-muted-foreground">
          Metricas y moderacion de la plataforma.
        </p>
      </div>

      <AdminDashboard />

      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Publicaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs" className="mt-3">
          <AdminJobsSection />
        </TabsContent>
        <TabsContent value="users" className="mt-3">
          <AdminUsersSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

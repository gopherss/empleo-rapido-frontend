import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { JobCard } from '@/components/jobs/JobCard'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOpenJobs } from '@/hooks/useJobs'
import { LIMITS } from '@/lib/validation'
import { useAuthStore } from '@/store/auth'
import { useJobFilters } from '@/store/filters'
import { CATEGORY_OPTIONS } from '@/types/api'

const PAGE_SIZE = 10

export function JobsFeedPage() {
  const user = useAuthStore((state) => state.user)
  const { category, q, sort, setCategory, setQuery, setSort } = useJobFilters()
  const [search, setSearch] = useState(q)
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      city: user?.city ?? undefined,
      latitude: user?.latitude ?? undefined,
      longitude: user?.longitude ?? undefined,
      category: category === 'ALL' ? undefined : category,
      q: q || undefined,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
    [user?.city, user?.latitude, user?.longitude, category, q, sort, page],
  )

  const { data, isLoading, isError, error } = useOpenJobs(params)

  const goToPage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setQuery(search.trim())
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trabajos disponibles</h1>
        <p className="text-sm text-muted-foreground">
          {user?.city
            ? `Publicaciones en ${user.city} ordenadas por cercania`
            : 'Publicaciones abiertas ordenadas por cercania'}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={submitSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por titulo o descripcion..."
            className="pl-9"
            maxLength={LIMITS.search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value as typeof category)
            setPage(1)
          }}
        >
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorias</SelectItem>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value as typeof sort)
            setPage(1)
          }}
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Mas cercanos</SelectItem>
            <SelectItem value="recent">Mas recientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title="No pudimos cargar los trabajos"
          description={
            error instanceof Error ? error.message : 'Intenta de nuevo mas tarde.'
          }
        />
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No hay trabajos disponibles"
          description="Vuelve mas tarde o cambia los filtros de busqueda."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination
            page={data.meta.page}
            pages={data.meta.pages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  )
}

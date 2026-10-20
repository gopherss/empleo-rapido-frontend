import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function getPageItems(page: number, pages: number): (number | 'ellipsis')[] {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index + 1)
  }

  const left = Math.max(2, page - 1)
  const right = Math.min(pages - 1, page + 1)
  const items: (number | 'ellipsis')[] = [1]

  if (left > 2) items.push('ellipsis')
  for (let current = left; current <= right; current += 1) items.push(current)
  if (right < pages - 1) items.push('ellipsis')
  items.push(pages)

  return items
}

export function Pagination({
  page,
  pages,
  onPageChange,
  className,
}: {
  page: number
  pages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  if (pages <= 1) return null

  const items = getPageItems(page, pages)

  return (
    <nav
      aria-label="Paginacion"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Pagina anterior"
      >
        <ChevronLeft />
      </Button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(item)}
            aria-label={`Pagina ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Pagina siguiente"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}

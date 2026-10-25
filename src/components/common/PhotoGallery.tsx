import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { resolveMediaUrl } from '@/lib/api'
import { cn } from '@/lib/utils'

export function PhotoGallery({
  photos,
  className,
}: {
  photos: string[]
  className?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const [zoomed, setZoomed] = useState(false)

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          'flex h-40 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground',
          className,
        )}
      >
        Sin fotos
      </div>
    )
  }

  const close = () => {
    setActive(null)
    setZoomed(false)
  }

  const go = (delta: number) => {
    setZoomed(false)
    setActive((current) =>
      current === null
        ? current
        : (current + delta + photos.length) % photos.length,
    )
  }

  const current = active !== null ? photos[active] : null

  return (
    <>
      <div
        className={cn(
          'grid gap-2',
          photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3',
          className,
        )}
      >
        {photos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            onClick={() => {
              setZoomed(false)
              setActive(index)
            }}
            aria-label={`Ampliar foto ${index + 1}`}
            className={cn(
              'group relative overflow-hidden rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              photos.length === 1 && 'max-h-80',
            )}
          >
            <img
              src={resolveMediaUrl(photo)}
              alt={`Foto ${index + 1}`}
              className="size-full max-h-80 object-cover transition-transform duration-200 ease-in-out group-hover:scale-110"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
              <ZoomIn className="size-6 text-white" />
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={current !== null}
        onOpenChange={(open) => {
          if (!open) close()
        }}
      >
        <DialogContent
          className="max-w-5xl border-none bg-black/90 p-0 text-white sm:p-2"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') go(-1)
            if (event.key === 'ArrowRight') go(1)
          }}
        >
          <DialogTitle className="sr-only">Foto ampliada</DialogTitle>
          <div
            className={cn(
              'flex max-h-[88vh] items-center justify-center overflow-auto',
              zoomed && 'cursor-zoom-out',
            )}
          >
            {current && (
              <img
                src={resolveMediaUrl(current)}
                alt="Foto ampliada"
                onClick={() => setZoomed((value) => !value)}
                className={cn(
                  'select-none',
                  zoomed
                    ? 'max-h-none max-w-none cursor-zoom-out'
                    : 'max-h-[85vh] w-auto max-w-full cursor-zoom-in object-contain',
                )}
              />
            )}
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {(active ?? 0) + 1} / {photos.length}
              </span>
            </>
          )}

          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? 'Alejar' : 'Acercar'}
            className="absolute left-2 top-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            {zoomed ? (
              <ZoomOut className="size-5" />
            ) : (
              <ZoomIn className="size-5" />
            )}
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

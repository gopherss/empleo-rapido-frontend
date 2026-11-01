import { MapPin } from 'lucide-react'

import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface LocationCityFieldProps {
  city: string
  error?: string | null
  locating: boolean
  onCapture: () => void
  hasLocation: boolean
  placeholder?: string
  buttonLabel?: string
  capturedLabel?: string
  loadingLabel?: string
  hint?: string
  inline?: boolean
}

/** Campo de ciudad de solo lectura que se completa desde la ubicacion. */
export function LocationCityField({
  city,
  error,
  locating,
  onCapture,
  hasLocation,
  placeholder = "Usa 'Usar mi ubicacion actual'",
  buttonLabel = 'Usar mi ubicacion actual',
  capturedLabel = 'Ubicacion capturada',
  loadingLabel = 'Obteniendo ubicacion...',
  hint,
  inline = false,
}: LocationCityFieldProps) {
  if (inline) {
    return (
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Input
              id="city"
              readOnly
              placeholder={placeholder}
              className="cursor-not-allowed bg-muted"
              aria-invalid={Boolean(error)}
              value={city}
            />
            <FieldError message={error} />
          </div>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'sm:w-auto',
              error &&
                'border-destructive text-destructive hover:text-destructive',
            )}
            aria-invalid={Boolean(error)}
            onClick={onCapture}
            disabled={locating}
          >
            <MapPin />
            {hasLocation
              ? capturedLabel
              : locating
                ? loadingLabel
                : buttonLabel}
          </Button>
        </div>
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="city">Ciudad</Label>
      <Input
        id="city"
        readOnly
        placeholder={placeholder}
        className="cursor-not-allowed bg-muted"
        aria-invalid={Boolean(error)}
        value={city}
      />
      <FieldError message={error} />
      <div className="space-y-1">
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full',
            error &&
              'border-destructive text-destructive hover:text-destructive',
          )}
          aria-invalid={Boolean(error)}
          onClick={onCapture}
          disabled={locating}
        >
          <MapPin />
          {hasLocation
            ? capturedLabel
            : locating
              ? loadingLabel
              : buttonLabel}
        </Button>
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  )
}

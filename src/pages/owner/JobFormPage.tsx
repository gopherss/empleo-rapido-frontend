import { MapPin, ShieldAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { PhotoPicker } from '@/components/common/PhotoPicker'
import { PageLoader } from '@/components/common/Spinner'
import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateJob, useJob, useUpdateJob } from '@/hooks/useJobs'
import { reverseGeocodeCity } from '@/lib/geocode'
import { LIMITS, validateRequired } from '@/lib/validation'
import { useAuthStore } from '@/store/auth'
import type { Currency, JobDetail, WorkCategory } from '@/types/api'
import {
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  CURRENCY_SYMBOLS,
} from '@/types/api'

interface JobFormProps {
  isEdit: boolean
  existing?: JobDetail
  defaultCity: string
}

function JobForm({ isEdit, existing, defaultCity }: JobFormProps) {
  const navigate = useNavigate()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(existing?.id ?? '')

  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [category, setCategory] = useState<WorkCategory>(
    existing?.category ?? 'PLOMERIA',
  )
  const [city, setCity] = useState(existing?.city ?? defaultCity)
  const [address, setAddress] = useState(existing?.address ?? '')
  const [budget, setBudget] = useState(
    existing?.budget ? String(existing.budget) : '',
  )
  const [currency, setCurrency] = useState<Currency>(
    existing?.currency ?? 'PEN',
  )
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    existing ? { lat: existing.latitude, lng: existing.longitude } : null,
  )
  const [locating, setLocating] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<
    Partial<Record<'title' | 'description' | 'city' | 'budget' | 'address', string | null>>
  >({})

  const clearError = (
    key: 'title' | 'description' | 'city' | 'budget' | 'address',
  ) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const captureLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Tu navegador no soporta geolocalizacion')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setCoords({ lat, lng })
        const detectedCity = await reverseGeocodeCity(lat, lng)
        if (detectedCity) {
          setCity(detectedCity)
          clearError('city')
        }
        setLocating(false)
      },
      () => {
        setLocating(false)
        toast.error('No pudimos obtener tu ubicacion')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const budgetValue = budget.trim()
    const next = {
      title: validateRequired(title, 'un titulo', LIMITS.jobTitle),
      description: validateRequired(
        description,
        'una descripcion',
        LIMITS.jobDescription,
      ),
      city: isEdit ? null : validateRequired(city, 'la ciudad', LIMITS.city),      address:
        address.trim().length > LIMITS.address
          ? `Maximo ${LIMITS.address} caracteres`
          : null,
      budget:
        budgetValue && (Number.isNaN(Number(budgetValue)) || Number(budgetValue) < 0)
          ? 'Ingresa un presupuesto valido'
          : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    if (isEdit) {
      updateJob.mutate(
        {
          title: title.trim(),
          description: description.trim(),
          category,
          address: address.trim() || undefined,
          budget: budgetValue ? Number(budgetValue) : undefined,
          photos: photos.length > 0 ? photos : undefined,
        },
        { onSuccess: (job) => navigate(`/jobs/${job.id}`) },
      )
      return
    }

    if (!coords) {
      toast.error('Necesitamos la ubicacion del trabajo')
      return
    }

    createJob.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        city: city.trim(),
        address: address.trim() || undefined,
        latitude: coords.lat,
        longitude: coords.lng,
        budget: budgetValue ? Number(budgetValue) : undefined,
        currency,
        photos,
      },
      { onSuccess: (job) => navigate(`/jobs/${job.id}`) },
    )
  }

  const isPending = createJob.isPending || updateJob.isPending

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Editar publicacion' : 'Publicar un trabajo'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Describe el problema para que los trabajadores cercanos puedan
          postularse.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del trabajo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                maxLength={LIMITS.jobTitle}
                aria-invalid={Boolean(errors.title)}
                placeholder="Ej: Arreglar fuga en el bano"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  clearError('title')
                }}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                maxLength={LIMITS.jobDescription}
                className="min-h-28"
                aria-invalid={Boolean(errors.description)}
                placeholder="Explica con detalle que necesitas..."
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value)
                  clearError('description')
                }}
              />
              <div className="flex items-center justify-between">
                <FieldError message={errors.description} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {description.length}/{LIMITS.jobDescription}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as WorkCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Presupuesto ({CURRENCY_SYMBOLS[currency]})
                </Label>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step="1"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.budget)}
                  placeholder="Opcional"
                  value={budget}
                  onChange={(event) => {
                    setBudget(event.target.value)
                    clearError('budget')
                  }}
                />
                <FieldError message={errors.budget} />
              </div>
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda del presupuesto</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as Currency)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecciona una moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Direccion (opcional)</Label>
              <Input
                id="address"
                maxLength={LIMITS.address}
                aria-invalid={Boolean(errors.address)}
                placeholder="Av. Monseñor Rivero #123"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value)
                  clearError('address')
                }}
              />
              <FieldError message={errors.address} />
            </div>

            {!isEdit && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      readOnly
                      aria-invalid={Boolean(errors.city)}
                      placeholder="Usa 'Usar mi ubicacion'"
                      className="cursor-not-allowed bg-muted"
                      value={city}
                    />
                    <FieldError message={errors.city} />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={captureLocation}
                      disabled={locating}
                    >
                      <MapPin />
                      {coords
                        ? 'Ubicacion lista'
                        : locating
                          ? 'Obteniendo...'
                          : 'Usar mi ubicacion'}
                    </Button>
                  </div>
                </div>
                {!coords && (
                  <p className="text-xs text-warning">
                    Necesitas marcar la ubicacion del trabajo
                    (geolocalizacion).
                  </p>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label>Fotos (hasta 3)</Label>
              <PhotoPicker files={photos} onChange={setPhotos} max={3} />
              {isEdit && (
                <p className="text-xs text-muted-foreground">
                  Si subes fotos nuevas, reemplazaran a las anteriores.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Guardando...'
                  : isEdit
                    ? 'Guardar cambios'
                    : 'Publicar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function JobFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const user = useAuthStore((state) => state.user)
  const { data: existing, isLoading } = useJob(isEdit ? id : undefined)

  if (isEdit && isLoading) return <PageLoader />
  if (isEdit && !existing) {
    return <p className="text-muted-foreground">Publicacion no encontrada.</p>
  }

  if (!isEdit && user?.idVerificationStatus !== 'VERIFIED') {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded-xl border border-warning/40 bg-warning/10 p-6 text-sm">
        <p className="inline-flex items-center gap-1.5 text-base font-semibold text-warning">
          <ShieldAlert className="size-5" />
          Verifica tu identidad para publicar
        </p>
        <p className="text-muted-foreground">
          Necesitas completar la verificacion de identidad antes de publicar un
          trabajo.
        </p>
        <Button asChild variant="outline">
          <Link to="/settings">Verificar ahora</Link>
        </Button>
      </div>
    )
  }

  return (
    <JobForm
      key={existing?.id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      defaultCity={user?.city ?? ''}
    />
  )
}

import { Building2, MapPin, Wrench } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { useRegister } from '@/hooks/useAuth'
import {
  LIMITS,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from '@/lib/validation'
import { cn } from '@/lib/utils'
import type { Role } from '@/types/api'

type FormErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'password' | 'phone' | 'city', string | null>
>

export function RegisterPage() {
  const register = useRegister()
  const [role, setRole] = useState<Role>('WORKER')
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const captureLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Tu navegador no soporta geolocalizacion')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocating(false)
        toast.success('Ubicacion capturada')
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

    const next: FormErrors = {
      firstName: validateRequired(form.firstName, 'tu nombre', LIMITS.name),
      lastName: validateRequired(form.lastName, 'tu apellido', LIMITS.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      phone: validatePhone(form.phone),
      city: form.city.trim().length > LIMITS.city
        ? `Maximo ${LIMITS.city} caracteres`
        : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    register.mutate({
      ...form,
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      city: form.city.trim() || undefined,
      role,
      latitude: coords?.lat,
      longitude: coords?.lng,
    })
  }

  const roleOptions: { value: Role; label: string; icon: typeof Wrench }[] = [
    { value: 'WORKER', label: 'Busco trabajo', icon: Wrench },
    { value: 'HOMEOWNER', label: 'Necesito un servicio', icon: Building2 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Crear cuenta</CardTitle>
        <CardDescription>Unete a EmpleoRapido en un minuto.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((option) => {
              const Icon = option.icon
              const active = role === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50',
                  )}
                >
                  <Icon className="size-5" />
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                maxLength={LIMITS.name}
                autoComplete="given-name"
                aria-invalid={Boolean(errors.firstName)}
                value={form.firstName}
                onChange={(event) => setField('firstName', event.target.value)}
              />
              <FieldError message={errors.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                maxLength={LIMITS.name}
                autoComplete="family-name"
                aria-invalid={Boolean(errors.lastName)}
                value={form.lastName}
                onChange={(event) => setField('lastName', event.target.value)}
              />
              <FieldError message={errors.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              aria-invalid={Boolean(errors.email)}
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
            />
            <FieldError message={errors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              maxLength={LIMITS.passwordMax}
              aria-invalid={Boolean(errors.password)}
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
            />
            <FieldError
              message={errors.password}
              className="text-muted-foreground"
            />
            {!errors.password && (
              <p className="text-xs text-muted-foreground">
                Minimo {LIMITS.passwordMin} caracteres.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp (opcional)</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+591..."
                maxLength={LIMITS.phone}
                aria-invalid={Boolean(errors.phone)}
                value={form.phone}
                onChange={(event) => setField('phone', event.target.value)}
              />
              <FieldError message={errors.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad (opcional)</Label>
              <Input
                id="city"
                placeholder="Santa Cruz"
                maxLength={LIMITS.city}
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
                value={form.city}
                onChange={(event) => setField('city', event.target.value)}
              />
              <FieldError message={errors.city} />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={captureLocation}
            disabled={locating}
          >
            <MapPin />
            {coords
              ? 'Ubicacion capturada'
              : locating
                ? 'Obteniendo ubicacion...'
                : 'Usar mi ubicacion actual'}
          </Button>

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Inicia sesion
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

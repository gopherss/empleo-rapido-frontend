import { MapPin } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { AvatarUploader } from '@/components/common/AvatarUploader'
import { FieldError } from '@/components/common/FieldError'
import { IdentityVerificationCard } from '@/components/identity/IdentityVerificationCard'
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
import { useGeolocation } from '@/hooks/useGeolocation'
import { useUpdateMe } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/auth'
import { ROLE_LABELS } from '@/types/api'
import {
  LIMITS,
  validatePhone,
  validateRequired,
} from '@/lib/validation'

type FormErrors = Partial<
  Record<'firstName' | 'lastName' | 'phone' | 'city', string | null>
>

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const updateMe = useUpdateMe()
  const { request, isLoading: locating } = useGeolocation()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [errors, setErrors] = useState<FormErrors>({})

  const clearError = (key: keyof FormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const next: FormErrors = {
      firstName: validateRequired(firstName, 'tu nombre', LIMITS.name),
      lastName: validateRequired(lastName, 'tu apellido', LIMITS.name),
      phone: validatePhone(phone, { required: true }),
      city: validateRequired(city, 'tu ciudad', LIMITS.city),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    updateMe.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      city: city.trim(),
    })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Administra tu informacion de cuenta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            {user?.email} - {user ? ROLE_LABELS[user.role] : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AvatarUploader />
          </div>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  maxLength={LIMITS.name}
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value)
                    clearError('firstName')
                  }}
                />
                <FieldError message={errors.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  maxLength={LIMITS.name}
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value)
                    clearError('lastName')
                  }}
                />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+591..."
                maxLength={LIMITS.phone}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value)
                  clearError('phone')
                }}
              />
              <FieldError message={errors.phone} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                readOnly
                value={city}
                placeholder="Usa 'Actualizar ubicacion'"
                className="cursor-not-allowed bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Se asigna automaticamente desde tu ubicacion.
              </p>
              <FieldError message={errors.city} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={updateMe.isPending}>
                {updateMe.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  request((detectedCity) => {
                    setCity(detectedCity)
                    clearError('city')
                  })
                }
                disabled={locating}
              >
                <MapPin />
                {locating ? 'Obteniendo...' : 'Actualizar ubicacion'}
              </Button>
            </div>

            {user?.latitude !== null && user?.longitude !== null && (
              <p className="text-xs text-muted-foreground">
                Ubicacion actual: {user?.latitude?.toFixed(4)},{' '}
                {user?.longitude?.toFixed(4)}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <IdentityVerificationCard />
    </div>
  )
}

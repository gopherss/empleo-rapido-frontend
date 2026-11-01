import { useState, type FormEvent } from 'react'

import { AvatarUploader } from '@/components/common/AvatarUploader'
import { FieldError } from '@/components/common/FieldError'
import { IdentityVerificationCard } from '@/components/identity/IdentityVerificationCard'
import { LocationCityField } from '@/components/common/LocationCityField'
import { PhoneInput } from '@/components/common/PhoneInput'
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
import { useLocationCapture } from '@/hooks/useLocationCapture'
import { useUpdateMe } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/auth'
import { ROLE_LABELS } from '@/types'
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
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [errors, setErrors] = useState<FormErrors>({})

  const clearError = (key: keyof FormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const { locating, capture } = useLocationCapture({
    persist: true,
    onCity: (detectedCity) => {
      setCity(detectedCity)
      clearError('city')
    },
  })

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
      address: address.trim(),
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
          <div className="mb-6 flex items-center gap-4">
            <AvatarUploader />
            <div className="min-w-0">
              <p className="truncate font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {user ? ROLE_LABELS[user.role] : ''}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG o WebP</p>
            </div>
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

            <PhoneInput
              value={phone}
              onChange={(value) => {
                setPhone(value)
                clearError('phone')
              }}
              error={errors.phone}
            />

            <div className="space-y-2">
              <Label htmlFor="address">Direccion</Label>
              <Input
                id="address"
                maxLength={LIMITS.address}
                placeholder="Av. Monseñor Rivero #123"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Se usa como direccion por defecto al publicar un trabajo.
              </p>
            </div>

            <LocationCityField
              city={city}
              error={errors.city}
              locating={locating}
              onCapture={capture}
              hasLocation={
                user?.latitude !== null && user?.longitude !== null
              }
              placeholder="Usa 'Actualizar ubicacion'"
              buttonLabel="Actualizar ubicacion"
              loadingLabel="Obteniendo..."
              capturedLabel="Ubicacion actualizada"
              hint="Se asigna automaticamente desde tu ubicacion."
              inline
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={updateMe.isPending}>
                {updateMe.isPending ? 'Guardando...' : 'Guardar cambios'}
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

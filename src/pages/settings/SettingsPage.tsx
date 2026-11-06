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
import { PasswordInput } from '@/components/ui/password-input'
import { useLocationCapture } from '@/hooks/useLocationCapture'
import { useUpdateMe, useUpdatePassword } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/auth'
import { ROLE_LABELS } from '@/types'
import {
  LIMITS,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from '@/lib/validation'

type FormErrors = Partial<
  Record<
    'firstName' | 'lastName' | 'phone' | 'city' | 'email' | 'password' | 'confirmPassword',
    string | null
  >
>

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const updateMe = useUpdateMe()
  const changePassword = useUpdatePassword()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    const wantsPassword = Boolean(newPassword || confirmPassword)

    const next: FormErrors = {
      firstName: validateRequired(firstName, 'tu nombre', LIMITS.name),
      lastName: validateRequired(lastName, 'tu apellido', LIMITS.name),
      phone: validatePhone(phone, { required: true }),
      email: validateEmail(email),
      city: validateRequired(city, 'tu ciudad', LIMITS.city),
      password: wantsPassword ? validatePassword(newPassword) : null,
      confirmPassword: wantsPassword
        ? newPassword === confirmPassword
          ? null
          : 'Las contrasenas no coinciden'
        : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    const emailChanged = Boolean(
      user && email.trim().toLowerCase() !== user.email,
    )
    const basePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
    }
    const clearPasswords = () => {
      setNewPassword('')
      setConfirmPassword('')
    }

    if (wantsPassword) {
      updateMe.mutate(
        {
          ...basePayload,
          ...(emailChanged ? { email: email.trim().toLowerCase() } : {}),
        },
        {
          onSuccess: () => {
            changePassword.mutate(newPassword, {
              onSuccess: clearPasswords,
            })
          },
        },
      )
      return
    }

    updateMe.mutate(
      {
        ...basePayload,
        ...(emailChanged ? { email: email.trim().toLowerCase() } : {}),
      },
      { onSuccess: clearPasswords },
    )
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
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                maxLength={LIMITS.email}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  clearError('email')
                }}
              />
              <FieldError message={errors.email} />
            </div>

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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contrasena</Label>
                <PasswordInput
                  id="newPassword"
                  autoComplete="new-password"
                  maxLength={LIMITS.passwordMax}
                  aria-invalid={Boolean(errors.password)}
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value)
                    clearError('password')
                  }}
                />
                <FieldError message={errors.password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  maxLength={LIMITS.passwordMax}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    clearError('confirmPassword')
                  }}
                />
                <FieldError message={errors.confirmPassword} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Dejalo vacio si no deseas cambiar tu contrasena.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={updateMe.isPending || changePassword.isPending}
              >
                {updateMe.isPending || changePassword.isPending
                  ? 'Guardando...'
                  : 'Guardar cambios'}
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

      {user?.role !== 'ADMIN' && <IdentityVerificationCard />}
    </div>
  )
}

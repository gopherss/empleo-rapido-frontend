import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

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
import { useLogin } from '@/hooks/useAuth'
import { LIMITS, validateEmail, validatePassword } from '@/lib/validation'

export function LoginPage() {
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string | null
    password?: string | null
  }>({})

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const next = {
      email: validateEmail(email),
      password: validatePassword(password, { min: 1 }),
    }
    setErrors(next)
    if (next.email || next.password) return

    login.mutate({ email: email.trim(), password })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Iniciar sesion</CardTitle>
        <CardDescription>
          Ingresa para encontrar o publicar trabajos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              aria-invalid={Boolean(errors.email)}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
              }}
            />
            <FieldError message={errors.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              maxLength={LIMITS.passwordMax}
              aria-invalid={Boolean(errors.password)}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: null }))
              }}
            />
            <FieldError message={errors.password} />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
          >
            {login.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

import { Plus, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { RatingStars } from '@/components/common/RatingStars'
import { PageLoader } from '@/components/common/Spinner'
import { FieldError } from '@/components/common/FieldError'
import { Badge } from '@/components/ui/badge'
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
import { useMyCv, useUpdateMyCv } from '@/hooks/useWorkers'
import { LIMITS } from '@/lib/validation'
import { cn } from '@/lib/utils'
import {
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  type Currency,
  type WorkCategory,
  type WorkerCv,
} from '@/types'

function WorkerCvForm({ cv }: { cv: WorkerCv }) {
  const updateCv = useUpdateMyCv()
  const [headline, setHeadline] = useState(cv.headline ?? '')
  const [bio, setBio] = useState(cv.bio ?? '')
  const [categories, setCategories] = useState<WorkCategory[]>(cv.categories)
  const [skills, setSkills] = useState<string[]>(cv.skills)
  const [skillInput, setSkillInput] = useState('')
  const [experienceYears, setExperienceYears] = useState(
    cv.experienceYears?.toString() ?? '',
  )
  const [hourlyRate, setHourlyRate] = useState(
    cv.hourlyRate ? String(cv.hourlyRate) : '',
  )
  const [currency, setCurrency] = useState<Currency>(cv.currency ?? 'PEN')
  const [isAvailable, setIsAvailable] = useState(cv.isAvailable)
  const [errors, setErrors] = useState<
    Partial<Record<'headline' | 'bio' | 'experienceYears' | 'hourlyRate' | 'skill', string | null>>
  >({})

  const clearError = (
    key: 'headline' | 'bio' | 'experienceYears' | 'hourlyRate' | 'skill',
  ) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const toggleCategory = (category: WorkCategory) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    )
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value) return
    if (value.length > LIMITS.skill) {
      setErrors((prev) => ({
        ...prev,
        skill: `Maximo ${LIMITS.skill} caracteres`,
      }))
      return
    }
    if (skills.includes(value)) {
      setErrors((prev) => ({ ...prev, skill: 'Esa habilidad ya existe' }))
      return
    }
    setSkills((prev) => [...prev, value])
    setSkillInput('')
    clearError('skill')
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const experienceValue = experienceYears.trim()
    const rateValue = hourlyRate.trim()
    const next = {
      headline:
        headline.trim().length > LIMITS.headline
          ? `Maximo ${LIMITS.headline} caracteres`
          : null,
      bio:
        bio.trim().length > LIMITS.bio
          ? `Maximo ${LIMITS.bio} caracteres`
          : null,
      experienceYears:
        experienceValue &&
        (!Number.isInteger(Number(experienceValue)) ||
          Number(experienceValue) < 0 ||
          Number(experienceValue) > LIMITS.experienceYearsMax)
          ? `Entre 0 y ${LIMITS.experienceYearsMax}`
          : null,
      hourlyRate:
        rateValue &&
        (Number.isNaN(Number(rateValue)) ||
          Number(rateValue) < 0 ||
          Number(rateValue) > LIMITS.hourlyRateMax)
          ? `Ingresa una tarifa valida (maximo ${LIMITS.hourlyRateMax})`
          : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    updateCv.mutate({
      headline: headline.trim() || undefined,
      bio: bio.trim() || undefined,
      categories,
      skills,
      experienceYears: experienceValue ? Number(experienceValue) : undefined,
      hourlyRate: rateValue ? Number(rateValue) : undefined,
      currency,
      isAvailable,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi CV</h1>
        <p className="text-sm text-muted-foreground">
          Este CV se envia automaticamente cuando te postulas a un trabajo.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle>Datos profesionales</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="headline">Titulo profesional</Label>
                <Input
                  id="headline"
                  maxLength={LIMITS.headline}
                  aria-invalid={Boolean(errors.headline)}
                  placeholder="Ej: Plomero con 10 anos de experiencia"
                  value={headline}
                  onChange={(event) => {
                    setHeadline(event.target.value)
                    clearError('headline')
                  }}
                />
                <FieldError message={errors.headline} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Sobre mi</Label>
                <Textarea
                  id="bio"
                  maxLength={LIMITS.bio}
                  aria-invalid={Boolean(errors.bio)}
                  placeholder="Describe tu experiencia y servicios..."
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value)
                    clearError('bio')
                  }}
                />
                <div className="flex items-center justify-between">
                  <FieldError message={errors.bio} />
                  <span className="ml-auto text-xs text-muted-foreground">
                    {bio.length}/{LIMITS.bio}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORY_OPTIONS.map((option) => {
                    const active = categories.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleCategory(option.value)}
                        className={cn(
                          'rounded-md border px-3 py-1.5 text-sm transition-colors',
                          active
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50',
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill">Habilidades</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill"
                    maxLength={LIMITS.skill}
                    aria-invalid={Boolean(errors.skill)}
                    placeholder="Ej: Instalaciones, fugas"
                    value={skillInput}
                    onChange={(event) => {
                      setSkillInput(event.target.value)
                      clearError('skill')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus />
                  </Button>
                </div>
                <FieldError message={errors.skill} />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills((prev) =>
                              prev.filter((item) => item !== skill),
                            )
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="experience">Anos de experiencia</Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    max={LIMITS.experienceYearsMax}
                    step="1"
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.experienceYears)}
                    value={experienceYears}
                    onChange={(event) => {
                      setExperienceYears(event.target.value)
                      clearError('experienceYears')
                    }}
                  />
                  <FieldError message={errors.experienceYears} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Tarifa por hora</Label>
                  <Input
                    id="rate"
                    type="number"
                    min={0}
                    step="1"
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.hourlyRate)}
                    value={hourlyRate}
                    onChange={(event) => {
                      setHourlyRate(event.target.value)
                      clearError('hourlyRate')
                    }}
                  />
                  <FieldError message={errors.hourlyRate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
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
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(event) => setIsAvailable(event.target.checked)}
                  className="size-4 rounded border-border"
                />
                Disponible para nuevos trabajos
              </label>

              <Button type="submit" disabled={updateCv.isPending}>
                {updateCv.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reputacion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RatingStars value={cv.averageRating} size="md" showValue />
              <p className="text-sm text-muted-foreground">
                {cv.completedJobs} trabajos completados
              </p>
              <Badge variant={cv.isAvailable ? 'success' : 'secondary'}>
                {cv.isAvailable ? 'Disponible' : 'No disponible'}
              </Badge>
            </CardContent>
          </Card>

          {cv.reviews && cv.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resenas recibidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cv.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="space-y-1">
                    <RatingStars value={review.rating} />
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

export function WorkerProfilePage() {
  const { data: cv, isLoading } = useMyCv()

  if (isLoading) return <PageLoader />
  if (!cv) {
    return <p className="text-muted-foreground">No se encontro tu CV.</p>
  }

  return <WorkerCvForm cv={cv} />
}

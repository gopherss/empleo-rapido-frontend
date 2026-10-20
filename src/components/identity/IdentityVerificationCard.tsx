import { Camera, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import type { IdentityDocumentKind } from '@/api/identity'
import { CameraCapture } from '@/components/common/CameraCapture'
import { FieldError } from '@/components/common/FieldError'
import { Badge } from '@/components/ui/badge'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  useIdentityDocument,
  useIdentityStatus,
  useSubmitIdentity,
} from '@/hooks/useIdentity'
import { LIMITS, onlyDigits, validateDni } from '@/lib/validation'

const DOCUMENT_LABELS: Record<IdentityDocumentKind, string> = {
  dniFront: 'Frente del DNI',
  dniBack: 'Reverso del DNI',
  selfie: 'Selfie',
}

function DocumentThumb({
  kind,
  enabled,
}: {
  kind: IdentityDocumentKind
  enabled: boolean
}) {
  const { data: url, isLoading } = useIdentityDocument(kind, enabled)

  return (
    <div className="space-y-1">
      <div className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
        {isLoading ? (
          <Skeleton className="size-full" />
        ) : url ? (
          <img
            src={url}
            alt={DOCUMENT_LABELS[kind]}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No disponible
          </div>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {DOCUMENT_LABELS[kind]}
      </p>
    </div>
  )
}

function FileField({
  id,
  label,
  file,
  onChange,
}: {
  id: string
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file && (
        <p className="truncate text-xs text-muted-foreground">{file.name}</p>
      )}
    </div>
  )
}

export function IdentityVerificationCard() {
  const { data: status, isLoading } = useIdentityStatus()
  const submit = useSubmitIdentity()

  const [dniNumber, setDniNumber] = useState('')
  const [dniError, setDniError] = useState<string | null>(null)
  const [dniFront, setDniFront] = useState<File | null>(null)
  const [dniBack, setDniBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const selfiePreview = useMemo(
    () => (selfie ? URL.createObjectURL(selfie) : null),
    [selfie],
  )

  useEffect(() => {
    return () => {
      if (selfiePreview) URL.revokeObjectURL(selfiePreview)
    }
  }, [selfiePreview])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const dniValidation = validateDni(dniNumber)
    setDniError(dniValidation)
    if (dniValidation) return

    if (!dniFront || !dniBack || !selfie) {
      toast.error('Selecciona el frente, el reverso del DNI y una selfie')
      return
    }
    submit.mutate(
      { dniNumber, dniFront, dniBack, selfie },
      {
        onSuccess: () => {
          setDniNumber('')
          setDniFront(null)
          setDniBack(null)
          setSelfie(null)
        },
      },
    )
  }

  const currentStatus = status?.status ?? 'NONE'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Verificacion de identidad
          {currentStatus === 'VERIFIED' && (
            <Badge variant="success">
              <ShieldCheck className="size-3" />
              Verificada
            </Badge>
          )}
          {currentStatus === 'PENDING' && (
            <Badge variant="warning">En verificacion</Badge>
          )}
          {currentStatus === 'REJECTED' && (
            <Badge variant="destructive">
              <ShieldAlert className="size-3" />
              Rechazada
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Sube tu DNI (frente y reverso) y una selfie para verificar tu
          identidad.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="aspect-[4/3]" />
              <Skeleton className="aspect-[4/3]" />
              <Skeleton className="aspect-[4/3]" />
            </div>
          </div>
        ) : currentStatus === 'VERIFIED' ? (
          <div className="space-y-4">
            <p className="text-sm">
              Identidad verificada
              {status?.dniNumber ? ` - DNI ${status.dniNumber}` : ''}
            </p>
            {status?.verifiedAt && (
              <p className="text-xs text-muted-foreground">
                Verificado el{' '}
                {new Date(status.verifiedAt).toLocaleDateString()}
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <DocumentThumb kind="dniFront" enabled />
              <DocumentThumb kind="dniBack" enabled />
              <DocumentThumb kind="selfie" enabled />
            </div>
          </div>
        ) : currentStatus === 'PENDING' ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <ShieldQuestion className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Tus documentos estan en revision. Te avisaremos cuando terminen.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {currentStatus === 'REJECTED' && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                <ShieldAlert className="mt-0.5 size-4 text-destructive" />
                <p className="text-sm text-destructive">
                  {status?.note ??
                    'No pudimos verificar tu identidad. Intenta nuevamente.'}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="dniNumber">Numero de DNI</Label>
              <Input
                id="dniNumber"
                inputMode="numeric"
                maxLength={LIMITS.dniMax}
                aria-invalid={Boolean(dniError)}
                placeholder="7654321"
                value={dniNumber}
                onChange={(event) => {
                  setDniNumber(onlyDigits(event.target.value))
                  if (dniError) setDniError(null)
                }}
              />
              <FieldError message={dniError} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FileField
                id="dniFront"
                label="Frente del DNI"
                file={dniFront}
                onChange={setDniFront}
              />
              <FileField
                id="dniBack"
                label="Reverso del DNI"
                file={dniBack}
                onChange={setDniBack}
              />
            </div>

            <div className="space-y-2">
              <Label>Selfie</Label>
              <div className="flex items-center gap-3">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground">
                  {selfiePreview ? (
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCameraOpen(true)}
                  >
                    <Camera />
                    {selfie ? 'Repetir selfie' : 'Tomar selfie'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => selfieInputRef.current?.click()}
                  >
                    Subir archivo
                  </Button>
                </div>
              </div>
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) =>
                  setSelfie(event.target.files?.[0] ?? null)
                }
              />
            </div>

            <Button
              type="submit"
              disabled={submit.isPending || dniNumber.length < LIMITS.dniMin}
            >
              {submit.isPending ? 'Verificando...' : 'Enviar a verificacion'}
            </Button>

            <CameraCapture
              open={cameraOpen}
              onOpenChange={setCameraOpen}
              onCapture={setSelfie}
            />
          </form>
        )}
      </CardContent>
    </Card>
  )
}

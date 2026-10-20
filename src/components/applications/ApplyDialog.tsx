import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useApplyToJob } from '@/hooks/useApplications'
import { LIMITS } from '@/lib/validation'

export function ApplyDialog({
  jobId,
  trigger,
}: {
  jobId: string
  trigger: React.ReactNode
}) {
  const apply = useApplyToJob()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    apply.mutate(
      { jobId, message: message || undefined },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postularme a este trabajo</DialogTitle>
          <DialogDescription>
            Tu CV se enviara automaticamente al dueno. Puedes agregar un
            mensaje.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="apply-message">Mensaje (opcional)</Label>
              <span className="text-xs text-muted-foreground">
                {message.length}/{LIMITS.applicationMessage}
              </span>
            </div>
            <Textarea
              id="apply-message"
              placeholder="Puedo ir hoy mismo, tengo experiencia en esto..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={LIMITS.applicationMessage}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={apply.isPending}>
              {apply.isPending ? 'Enviando...' : 'Enviar postulacion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

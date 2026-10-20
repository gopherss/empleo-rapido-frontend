import { useState, type FormEvent } from 'react'

import { PhotoPicker } from '@/components/common/PhotoPicker'
import { RatingStars } from '@/components/common/RatingStars'
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
import { useCreateReview } from '@/hooks/useReviews'
import { LIMITS } from '@/lib/validation'

export function ReviewDialog({
  jobId,
  trigger,
}: {
  jobId: string
  trigger: React.ReactNode
}) {
  const createReview = useCreateReview()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<File[]>([])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (photos.length === 0) return
    createReview.mutate(
      { jobId, payload: { rating, comment: comment || undefined, photos } },
      {
        onSuccess: () => {
          setOpen(false)
          setPhotos([])
          setComment('')
          setRating(5)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar y calificar</DialogTitle>
          <DialogDescription>
            Sube de 1 a 3 fotos del trabajo terminado y califica al trabajador.
            El trabajo pasara al historial del trabajador.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Calificacion</Label>
            <div className="flex justify-center py-2">
              <RatingStars
                value={rating}
                onChange={setRating}
                size="lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="comment">Comentario (opcional)</Label>
              <span className="text-xs text-muted-foreground">
                {comment.length}/{LIMITS.reviewComment}
              </span>
            </div>
            <Textarea
              id="comment"
              placeholder="Como fue el trabajo?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={LIMITS.reviewComment}
            />
          </div>

          <div className="space-y-2">
            <Label>Fotos del resultado</Label>
            <PhotoPicker
              files={photos}
              onChange={setPhotos}
              max={3}
              label="Agregar"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createReview.isPending || photos.length === 0}
            >
              {createReview.isPending ? 'Enviando...' : 'Finalizar trabajo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

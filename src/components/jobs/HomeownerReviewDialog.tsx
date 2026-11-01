import { useState, type FormEvent } from 'react'

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
import { useCreateHomeownerReview } from '@/hooks/useReviews'
import { LIMITS } from '@/lib/validation'

export function HomeownerReviewDialog({
  jobId,
  trigger,
}: {
  jobId: string
  trigger: React.ReactNode
}) {
  const createReview = useCreateHomeownerReview()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    createReview.mutate(
      { jobId, payload: { rating, comment: comment || undefined } },
      {
        onSuccess: () => {
          setOpen(false)
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
          <DialogTitle>Calificar al dueno</DialogTitle>
          <DialogDescription>
            Cuentanos como fue tu experiencia con el dueno de casa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Calificacion</Label>
            <div className="flex justify-center py-2">
              <RatingStars value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="homeowner-comment">Comentario (opcional)</Label>
              <span className="text-xs text-muted-foreground">
                {comment.length}/{LIMITS.reviewComment}
              </span>
            </div>
            <Textarea
              id="homeowner-comment"
              placeholder="Como fue tu experiencia?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={LIMITS.reviewComment}
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
            <Button type="submit" disabled={createReview.isPending}>
              {createReview.isPending ? 'Enviando...' : 'Enviar calificacion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

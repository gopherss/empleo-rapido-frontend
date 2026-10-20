import { cn } from '@/lib/utils'

interface FieldErrorProps {
  message?: string | null
  className?: string
}

/** Mensaje de error de un campo de formulario. No renderiza si no hay error. */
export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null
  return (
    <p className={cn('text-xs text-destructive', className)}>{message}</p>
  )
}

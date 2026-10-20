import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizes = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-7',
}

export function RatingStars({
  value,
  onChange,
  size = 'sm',
  showValue = false,
  className,
}: RatingStarsProps) {
  const interactive = Boolean(onChange)
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(value)
          const icon = (
            <Star
              className={cn(
                sizes[size],
                filled
                  ? 'fill-warning text-warning'
                  : 'fill-transparent text-muted-foreground/40',
              )}
            />
          )
          if (!interactive) return <span key={star}>{icon}</span>
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`${star} estrellas`}
            >
              {icon}
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {value > 0 ? value.toFixed(1) : 'Nuevo'}
        </span>
      )}
    </div>
  )
}

import { ImagePlus, X } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PhotoPickerProps {
  files: File[]
  onChange: (files: File[]) => void
  max?: number
  label?: string
  className?: string
}

export function PhotoPicker({
  files,
  onChange,
  max = 3,
  label = 'Agregar fotos',
  className,
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  )

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const merged = [...files, ...Array.from(list)].slice(0, max)
    onChange(merged)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-3 gap-3">
        {previews.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {files.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="size-5" />
            <span className="text-xs">{label}</span>
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {files.length}/{max} fotos. Se optimizan a formato webp.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => addFiles(event.target.files)}
      />
      {files.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([])}
        >
          Quitar todas
        </Button>
      )}
    </div>
  )
}

import { Camera, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CameraCaptureProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (file: File) => void
}

export function CameraCapture({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setReady(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new DOMException('unsupported', 'NotSupportedError')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err: unknown) {
        if (cancelled) return
        const denied =
          err instanceof DOMException &&
          (err.name === 'NotAllowedError' || err.name === 'SecurityError')
        const unsupported =
          err instanceof DOMException && err.name === 'NotSupportedError'
        setError(
          unsupported
            ? 'Este navegador no soporta el acceso a la camara.'
            : denied
              ? 'Debes habilitar el acceso a la camara para tomar la selfie.'
              : 'No se pudo acceder a la camara. Puedes subir una foto en su lugar.',
        )
      }
    }

    void start()

    return () => {
      cancelled = true
      stop()
    }
  }, [open, facingMode, stop])

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        onCapture(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }))
        onOpenChange(false)
      },
      'image/jpeg',
      0.92,
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) stop()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tomar selfie</DialogTitle>
          <DialogDescription>
            Habilita la camara y coloca tu rostro en el centro del encuadre.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
          {error ? (
            <div className="flex size-full items-center justify-center p-6 text-center text-sm text-white">
              {error}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => setReady(true)}
                className={cn(
                  'size-full object-cover',
                  facingMode === 'user' && '-scale-x-100',
                )}
              />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
                  Encendiendo camara...
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFacingMode((mode) =>
                mode === 'user' ? 'environment' : 'user',
              )
            }
            disabled={Boolean(error)}
          >
            <RefreshCw />
            Girar
          </Button>
          <Button
            type="button"
            onClick={capture}
            disabled={!ready || Boolean(error)}
          >
            <Camera />
            Capturar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

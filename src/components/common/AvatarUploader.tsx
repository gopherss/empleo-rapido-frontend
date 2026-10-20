import { Camera } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { useUploadAvatar } from '@/hooks/useUsers'
import { resolveMediaUrl } from '@/lib/api'
import { getInitials } from '@/lib/format'
import { useAuthStore } from '@/store/auth'

export function AvatarUploader() {
  const user = useAuthStore((state) => state.user)
  const uploadAvatar = useUploadAvatar()
  const inputRef = useRef<HTMLInputElement>(null)

  const onChange = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    uploadAvatar.mutate(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-4">
      <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-muted-foreground">
        {user?.avatarUrl ? (
          <img
            src={resolveMediaUrl(user.avatarUrl)}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          getInitials(user?.firstName, user?.lastName)
        )}
      </span>

      <div className="space-y-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploadAvatar.isPending}
        >
          <Camera />
          {uploadAvatar.isPending ? 'Subiendo...' : 'Cambiar foto'}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG o WebP
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => onChange(event.target.files)}
      />
    </div>
  )
}

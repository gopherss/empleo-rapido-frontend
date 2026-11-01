import { Camera, Loader2 } from 'lucide-react'
import { useRef } from 'react'

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
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploadAvatar.isPending}
      className="group relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl font-semibold text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
      aria-label="Cambiar foto de perfil"
    >
      {user?.avatarUrl ? (
        <img
          src={resolveMediaUrl(user.avatarUrl)}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        getInitials(user?.firstName, user?.lastName)
      )}
      {uploadAvatar.isPending ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2 className="size-7 animate-spin text-white" />
        </span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-7 text-white" />
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => onChange(event.target.files)}
      />
    </button>
  )
}

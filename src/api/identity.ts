import { api } from '@/lib/api'
import type { IdentityStatus } from '@/types/api'

export type IdentityDocumentKind = 'dniFront' | 'dniBack' | 'selfie'

export interface SubmitIdentityPayload {
  dniNumber: string
  dniFront: File
  dniBack: File
  selfie: File
}

export async function getIdentityStatus(): Promise<IdentityStatus> {
  const { data } = await api.get<IdentityStatus>('/identity')
  return data
}

export async function submitIdentity(
  payload: SubmitIdentityPayload,
): Promise<IdentityStatus> {
  const form = new FormData()
  form.append('dniNumber', payload.dniNumber)
  form.append('dniFront', payload.dniFront)
  form.append('dniBack', payload.dniBack)
  form.append('selfie', payload.selfie)

  const { data } = await api.post<IdentityStatus>('/identity', form)
  return data
}

/** Descarga un documento privado y devuelve un object URL temporal. */
export async function fetchIdentityDocument(
  kind: IdentityDocumentKind,
): Promise<string> {
  const { data } = await api.get<Blob>(`/identity/documents/${kind}`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(data)
}

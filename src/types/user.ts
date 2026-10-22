import type { IdVerificationStatus, Role } from './auth'
import type { WorkerProfile } from './worker'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: Role
  avatarUrl: string | null
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
  idVerificationStatus: IdVerificationStatus
  createdAt: string
  workerProfile?: WorkerProfile | null
}

export interface IdentityStatus {
  status: IdVerificationStatus
  dniNumber: string | null
  verifiedAt: string | null
  note: string | null
  hasDocuments: boolean
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

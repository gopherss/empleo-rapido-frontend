export const ROLES = ['WORKER', 'HOMEOWNER'] as const
export type Role = (typeof ROLES)[number]

export const JOB_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const APPLICATION_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const ID_VERIFICATION_STATUSES = [
  'NONE',
  'PENDING',
  'VERIFIED',
  'REJECTED',
] as const
export type IdVerificationStatus = (typeof ID_VERIFICATION_STATUSES)[number]

export const WORK_CATEGORIES = [
  'PLOMERIA',
  'ELECTRICIDAD',
  'CARPINTERIA',
  'PINTURA',
  'ALBANILERIA',
  'CERRAJERIA',
  'GAS',
  'ELECTRODOMESTICOS',
  'JARDINERIA',
  'LIMPIEZA',
  'AIRE_ACONDICIONADO',
  'TECHOS',
  'MUDANZAS',
  'OTROS',
] as const
export type WorkCategory = (typeof WORK_CATEGORIES)[number]

export const CURRENCIES = [
  'BOB',
  'USD',
  'EUR',
  'ARS',
  'BRL',
  'PEN',
  'CLP',
  'COP',
] as const
export type Currency = (typeof CURRENCIES)[number]

export const CURRENCY_LABELS: Record<Currency, string> = {
  BOB: 'Boliviano (Bs)',
  USD: 'Dolar estadounidense (US$)',
  EUR: 'Euro (EUR)',
  ARS: 'Peso argentino (AR$)',
  BRL: 'Real brasileno (R$)',
  PEN: 'Sol peruano (S/)',
  CLP: 'Peso chileno (CLP$)',
  COP: 'Peso colombiano (COL$)',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BOB: 'Bs',
  USD: 'US$',
  EUR: 'EUR',
  ARS: 'AR$',
  BRL: 'R$',
  PEN: 'S/',
  CLP: 'CLP$',
  COP: 'COL$',
}

export const CURRENCY_OPTIONS = CURRENCIES.map((value) => ({
  value,
  label: CURRENCY_LABELS[value],
}))

export const ROLE_LABELS: Record<Role, string> = {
  WORKER: 'Trabajador',
  HOMEOWNER: 'Dueno de casa',
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: 'Disponible',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  WITHDRAWN: 'Retirada',
}

export const ID_VERIFICATION_STATUS_LABELS: Record<
  IdVerificationStatus,
  string
> = {
  NONE: 'Sin verificar',
  PENDING: 'En verificacion',
  VERIFIED: 'Verificada',
  REJECTED: 'Rechazada',
}

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  PLOMERIA: 'Plomeria',
  ELECTRICIDAD: 'Electricidad',
  CARPINTERIA: 'Carpinteria',
  PINTURA: 'Pintura',
  ALBANILERIA: 'Albanileria',
  CERRAJERIA: 'Cerrajeria',
  GAS: 'Gas',
  ELECTRODOMESTICOS: 'Electrodomesticos',
  JARDINERIA: 'Jardineria',
  LIMPIEZA: 'Limpieza',
  AIRE_ACONDICIONADO: 'Aire acondicionado',
  TECHOS: 'Techos',
  MUDANZAS: 'Mudanzas',
  OTROS: 'Otros',
}

export const CATEGORY_OPTIONS = WORK_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))

export interface WorkerProfile {
  id: string
  userId: string
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  hourlyRate: string | number | null
  currency: Currency
  isAvailable: boolean
  averageRating: number
  completedJobs: number
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: Role
  avatarUrl: string | null
  city: string | null
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

export interface JobContact {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  phone?: string | null
  distanceKm?: number | null
}

export interface JobListItem {
  id: string
  title: string
  description: string
  category: WorkCategory
  city: string
  address: string | null
  budget: string | number | null
  currency: Currency
  latitude: number
  longitude: number
  status: JobStatus
  photo: string | null
  photoCount: number
  distanceKm: number | null
  applicationCount: number
  pendingApplicationCount: number
  applied: boolean
  createdAt: string
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  photos: string[]
  workerId: string
  jobId: string
  author?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  } | null
  job?: {
    id: string
    title: string
    category: WorkCategory
    city: string
  } | null
}

export interface JobDetail extends JobListItem {
  photos: string[]
  homeowner: JobContact
  worker?: JobContact | null
  selectedAt?: string | null
  completedAt?: string | null
  review?: Review | null
  myApplicationStatus?: ApplicationStatus | null
}

export interface WorkerCv {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  city: string | null
  phone: string | null
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  hourlyRate: string | number | null
  currency: Currency
  isAvailable: boolean
  averageRating: number
  completedJobs: number
  reviews?: Review[]
}

export interface Applicant {
  applicationId: string
  status: ApplicationStatus
  message: string | null
  appliedAt: string
  workerId: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  phone: string | null
  city: string | null
  headline: string | null
  bio: string | null
  categories: WorkCategory[]
  skills: string[]
  experienceYears: number | null
  averageRating: number
  completedJobs: number
  distanceKm: number | null
}

export interface MyApplication {
  id: string
  status: ApplicationStatus
  createdAt: string
  jobId: string
  jobTitle: string
  category: WorkCategory
  city: string
  jobStatus: JobStatus
}

export interface Paginated<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
}

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

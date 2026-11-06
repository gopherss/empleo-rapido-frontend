export type NotificationType =
  | 'APPLICATION_RECEIVED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'APPLICATION_WITHDRAWN'
  | 'JOB_COMPLETED'
  | 'AGREEMENT_CONFIRMED'
  | 'JOB_CANCELLED'
  | 'NEW_MESSAGE'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export interface NotificationsResponse {
  data: Notification[]
  unreadCount: number
}

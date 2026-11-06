import { api } from '@/lib/api'
import type { NotificationsResponse } from '@/types/notifications'

export async function getNotifications(): Promise<NotificationsResponse> {
  const { data } = await api.get<NotificationsResponse>('/notifications')
  return data
}

export async function markNotificationRead(id: string): Promise<{ success: boolean }> {
  const { data } = await api.patch<{ success: boolean }>(`/notifications/${id}/read`)
  return data
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>('/notifications/read-all')
  return data
}

export async function deleteNotification(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/notifications/${id}`)
  return data
}

import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications'
import { formatRelativeDate } from '@/lib/format'

export function NotificationBell() {
  const navigate = useNavigate()
  const { data } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const [open, setOpen] = useState(false)

  const unreadCount = data?.unreadCount ?? 0
  const notifications = data?.data ?? []

  const handleClick = (notification: (typeof notifications)[number]) => {
    if (!notification.read) {
      markRead.mutate(notification.id)
    }
    setOpen(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={(e) => {
                e.preventDefault()
                markAllRead.mutate()
              }}
            >
              Marcar todas como leidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Sin notificaciones
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 py-2"
              onClick={() => handleClick(notification)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <p className="font-medium">{notification.title}</p>
                {!notification.read && <span className="size-1.5 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(notification.createdAt)}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

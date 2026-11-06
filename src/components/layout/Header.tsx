import { Briefcase, FileText, LogOut, Menu, Moon, Settings, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/hooks/useAuth'
import { usePendingApplicationsCount } from '@/hooks/useApplications'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { resolveMediaUrl } from '@/lib/api'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { applyTheme, useThemeStore } from '@/store/theme'
import type { Role } from '@/types'
import { ROLE_LABELS } from '@/types'

interface NavItem {
  to: string
  label: string
  roles: Role[]
}

const navItems: NavItem[] = [
  { to: '/jobs', label: 'Trabajos', roles: ['WORKER'] },
  { to: '/applications', label: 'Mis postulaciones', roles: ['WORKER'] },
  { to: '/my-jobs', label: 'Mis publicaciones', roles: ['HOMEOWNER'] },
  { to: '/admin', label: 'Admin', roles: ['ADMIN'] },
]

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHomeowner = user?.role === 'HOMEOWNER'
  const { data: pendingCount = 0 } = usePendingApplicationsCount(
    Boolean(isHomeowner),
  )
  const pendingBadge =
    pendingCount > 0
      ? pendingCount > 99
        ? '99+'
        : String(pendingCount)
      : null

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const items = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  )

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </span>
          <span className="hidden sm:inline">EmpleoRapido</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                  isActive && 'bg-accent text-foreground',
                )
              }
            >
              {item.label}
              {item.to === '/my-jobs' && pendingBadge && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {pendingBadge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {user && <NotificationBell />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2 transition-colors hover:bg-accent">
                  <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {user.avatarUrl ? (
                      <img
                        src={resolveMediaUrl(user.avatarUrl)}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      getInitials(user.firstName, user.lastName)
                    )}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user.firstName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {ROLE_LABELS[user.role]}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'WORKER' && (
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <FileText />
                    Mi CV
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings />
                  Ajustes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout.mutate()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground',
                  isActive && 'bg-accent text-foreground',
                )
              }
            >
              {item.label}
              {item.to === '/my-jobs' && pendingBadge && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {pendingBadge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

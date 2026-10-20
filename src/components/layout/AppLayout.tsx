import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { LocationPrompt } from '@/components/layout/LocationPrompt'

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header />
      <LocationPrompt />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        EmpleoRapido - Encuentra o publica trabajos de reparacion del hogar
      </footer>
    </div>
  )
}

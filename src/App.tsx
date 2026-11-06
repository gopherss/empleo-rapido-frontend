import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute, RequireRole } from '@/components/layout/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import { useSessionBootstrap } from '@/hooks/useAuth'
import { LoginPage } from '@/pages/auth/LoginPage'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { HomeRedirect } from '@/pages/HomeRedirect'
import { AdminPage } from '@/pages/admin/AdminPage'
import { JobDetailPage } from '@/pages/jobs/JobDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { JobFormPage } from '@/pages/owner/JobFormPage'
import { MyJobsPage } from '@/pages/owner/MyJobsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { JobsFeedPage } from '@/pages/worker/JobsFeedPage'
import { MyApplicationsPage } from '@/pages/worker/MyApplicationsPage'
import { WorkerProfilePage } from '@/pages/worker/WorkerProfilePage'
import { WorkerPublicPage } from '@/pages/workers/WorkerPublicPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  useSessionBootstrap()
  return children
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionBootstrap>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomeRedirect />} />

                <Route
                  path="/jobs"
                  element={
                    <RequireRole roles={['WORKER']}>
                      <JobsFeedPage />
                    </RequireRole>
                  }
                />
                <Route path="/jobs/:id" element={<JobDetailPage />} />

                <Route
                  path="/applications"
                  element={
                    <RequireRole roles={['WORKER']}>
                      <MyApplicationsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireRole roles={['WORKER']}>
                      <WorkerProfilePage />
                    </RequireRole>
                  }
                />

                <Route
                  path="/my-jobs"
                  element={
                    <RequireRole roles={['HOMEOWNER']}>
                      <MyJobsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="/my-jobs/new"
                  element={
                    <RequireRole roles={['HOMEOWNER']}>
                      <JobFormPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="/my-jobs/:id/edit"
                  element={
                    <RequireRole roles={['HOMEOWNER']}>
                      <JobFormPage />
                    </RequireRole>
                  }
                />

                <Route path="/workers/:id" element={<WorkerPublicPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/admin"
                  element={
                    <RequireRole roles={['ADMIN']}>
                      <AdminPage />
                    </RequireRole>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SessionBootstrap>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

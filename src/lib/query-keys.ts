import type { ListJobsParams, ListMyJobsParams } from '@/api/jobs'
import type { ListMyApplicationsParams } from '@/api/applications'

export const queryKeys = {
  me: ['me'] as const,
  identity: ['identity'] as const,
  jobs: {
    all: ['jobs'] as const,
    open: (params: ListJobsParams) => ['jobs', 'open', params] as const,
    mine: ['jobs', 'mine'] as const,
    mineList: (params: ListMyJobsParams) =>
      ['jobs', 'mine', params] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
  },
  applications: {
    mine: ['applications', 'mine'] as const,
    mineList: (params: ListMyApplicationsParams) =>
      ['applications', 'mine', params] as const,
    pendingCount: ['applications', 'pending-count'] as const,
    forJob: (jobId: string) => ['applications', 'job', jobId] as const,
  },
  workers: {
    all: ['workers'] as const,
    cv: (id: string) => ['workers', 'cv', id] as const,
    reviews: (id: string) => ['workers', 'reviews', id] as const,
    myCv: ['workers', 'me'] as const,
  },
} as const

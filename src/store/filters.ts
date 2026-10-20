import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WorkCategory } from '@/types/api'

export interface JobFilters {
  category: WorkCategory | 'ALL'
  q: string
  sort: 'distance' | 'recent'
}

interface JobFiltersState extends JobFilters {
  setCategory: (category: WorkCategory | 'ALL') => void
  setQuery: (q: string) => void
  setSort: (sort: 'distance' | 'recent') => void
  reset: () => void
}

const defaults: JobFilters = { category: 'ALL', q: '', sort: 'distance' }

export const useJobFilters = create<JobFiltersState>()(
  persist(
    (set) => ({
      ...defaults,
      setCategory: (category) => set({ category }),
      setQuery: (q) => set({ q }),
      setSort: (sort) => set({ sort }),
      reset: () => set(defaults),
    }),
    { name: 'empleo-rapido-job-filters' },
  ),
)

import { create } from 'zustand'
import { FilterType, SortBy } from '@/types/filter'

// Define default state for each page
export interface PageDefaultState {
  sort_by?: string
  type?: string
  view_filters?: string
  group_by?: string
  page?: number
  limit?: number
  // Add other default filters as needed
}

// Define the default state configuration for each page
export const PAGE_DEFAULT_STATES: Record<string, PageDefaultState> = {
  sessions: {
    sort_by: SortBy.UPDATED_AT_DESC,
    type: FilterType.Agents
  },
  memory: {
    sort_by: SortBy.UPDATED_AT_DESC
  },
  v2memory: {
    sort_by: SortBy.UPDATED_AT_DESC,
    page: 1,
    limit: 20
  },
  knowledge: {
    sort_by: SortBy.UPDATED_AT_DESC
  },
  v2knowledge: {
    sort_by: SortBy.UPDATED_AT_DESC,
    page: 1,
    limit: 20
  },
  evaluation: {
    sort_by: SortBy.UPDATED_AT_DESC,
    type: 'all'
  },
  chat: {
    type: FilterType.Agents
  },
  traces: {
    group_by: 'sessions',
    page: 1,
    limit: 20
  }
}

export interface RouteState {
  pathname: string
  search: string
  hash: string
  timestamp: number
}

export interface RouteStateStore {
  // Store route states by page name (e.g., 'memory', 'sessions', 'knowledge')
  routeStates: Record<string, RouteState>

  // Save route state for a specific page
  savePageState: (
    pageName: string,
    pathname: string,
    search: string,
    hash?: string
  ) => void

  // Get route state for a specific page
  getPageState: (pageName: string) => RouteState | null

  // Check if a page has saved state
  hasPageState: (pageName: string) => boolean

  // Get default state for a specific page
  getPageDefaultState: (pageName: string) => PageDefaultState

  // Check if a page has default state configuration
  hasPageDefaultState: (pageName: string) => boolean

  // Get default state for current page based on pathname
  getCurrentPageDefaultState: (pathname: string) => PageDefaultState

  // Build default URL with default state for a page
  buildDefaultPageUrl: (pageName: string, pathname?: string) => string
}

export const useRouteStateStore = create<RouteStateStore>()((set, get) => ({
  routeStates: {},

  savePageState: (
    pageName: string,
    pathname: string,
    search: string,
    hash: string = ''
  ) => {
    set((prev) => {
      const newState = {
        routeStates: {
          ...prev.routeStates,
          [pageName]: {
            pathname,
            search,
            hash,
            timestamp: Date.now()
          }
        }
      }

      return newState
    })
  },

  getPageState: (pageName: string) => {
    const { routeStates } = get()
    const state = routeStates[pageName] || null

    return state
  },

  hasPageState: (pageName: string) => {
    const { routeStates } = get()
    const hasState = !!routeStates[pageName]

    return hasState
  },

  getPageDefaultState: (pageName: string) => {
    return PAGE_DEFAULT_STATES[pageName] || {}
  },

  hasPageDefaultState: (pageName: string) => {
    return !!PAGE_DEFAULT_STATES[pageName]
  },

  getCurrentPageDefaultState: (pathname: string) => {
    const pageName = getPageNameFromPathname(pathname)
    return get().getPageDefaultState(pageName)
  },

  buildDefaultPageUrl: (pageName: string, pathname?: string) => {
    const defaultState = get().getPageDefaultState(pageName)
    const basePath = pathname || `/${pageName}`

    if (!defaultState || Object.keys(defaultState).length === 0) {
      return basePath
    }

    const searchParams = new URLSearchParams()

    Object.entries(defaultState).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })

    const searchString = searchParams.toString()
    return searchString ? `${basePath}?${searchString}` : basePath
  }
}))

// Helper function to extract page name from pathname
function getPageNameFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  return segments[0] || 'home'
}

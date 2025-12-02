import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRouteStateStore } from '@/stores/RouteStateStore'

/**
 * Enhanced hook to save and restore route state by page name with default state fallback
 */
export const useRouteState = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    savePageState,
    getPageState,
    hasPageState,
    hasPageDefaultState,
    getCurrentPageDefaultState,
    buildDefaultPageUrl
  } = useRouteStateStore()

  // Track the last saved state to avoid unnecessary saves
  const lastSavedState = useRef<string>('')

  /**
   * Get page name from pathname (e.g., '/evaluation/123' -> 'evaluation')
   */
  const getPageName = (pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean)
    const pageName = segments[0] || ''
    return pageName
  }

  /**
   * Disable state preservation for specific pages
   * Currently, we disable for the chat page to avoid sticky sessions
   */
  const isStatePreservationDisabled = (pageName: string): boolean => {
    return pageName === 'chat'
  }

  /**
   * Check if current page should have default state applied
   * This happens when someone visits just the base path (e.g., /sessions)
   */
  const shouldApplyDefaultState = () => {
    const pageName = getPageName(location.pathname)
    const hasDefaults = hasPageDefaultState(pageName)
    const hasNoSearchParams = !location.search || location.search === ''
    const isBasePath =
      location.pathname === `/${pageName}` ||
      location.pathname === `/${pageName}/`

    return hasDefaults && hasNoSearchParams && isBasePath
  }

  /**
   * Apply default state to current page if needed
   */
  const applyDefaultStateIfNeeded = () => {
    if (shouldApplyDefaultState()) {
      const pageName = getPageName(location.pathname)
      const defaultUrl = buildDefaultPageUrl(pageName, location.pathname)

      // Navigate to the default state URL (replace to avoid adding to history)
      navigate(defaultUrl, { replace: true })
      return true
    }
    return false
  }

  /**
   * Save current page state
   */
  const saveCurrentPageState = () => {
    const { pathname, search, hash } = location
    const pageName = getPageName(pathname)

    // Do not persist state for excluded pages (e.g., chat)
    if (isStatePreservationDisabled(pageName)) {
      return
    }

    // Create a unique key for the current state
    const currentStateKey = `${pathname}${search}${hash}`

    // Only save if the state has actually changed
    if (currentStateKey === lastSavedState.current) {
      return
    }

    savePageState(pageName, pathname, search, hash)

    // Update the last saved state
    lastSavedState.current = currentStateKey
  }

  /**
   * Auto-save state whenever URL changes (including parameter changes)
   */
  useEffect(() => {
    // First, check if we need to apply default state
    const defaultStateApplied = applyDefaultStateIfNeeded()

    // Only save state if we didn't just apply default state
    // (to avoid saving the base path state before redirecting)
    if (!defaultStateApplied) {
      saveCurrentPageState()
    }
  }, [location.pathname, location.search, location.hash])

  /**
   * Navigate to a page and restore its saved state if it exists, or use default state
   * This function automatically saves the current page state before navigating
   */
  const navigateToPage = (pagePath: string) => {
    // First, save the current page state before navigating away
    saveCurrentPageState()

    const pageName = getPageName(pagePath)

    // For excluded pages (e.g., chat), always start from default state
    if (isStatePreservationDisabled(pageName)) {
      if (hasPageDefaultState(pageName)) {
        const defaultUrl = buildDefaultPageUrl(pageName, pagePath)
        navigate(defaultUrl)
        return
      }
      navigate(pagePath)
      return
    }

    // Check if we have saved state for the target page
    if (hasPageState(pageName)) {
      const savedState = getPageState(pageName)

      if (savedState) {
        // Navigate to the saved state (including search params)
        const fullPath = savedState.search
          ? `${savedState.pathname}${savedState.search}${savedState.hash}`
          : savedState.pathname

        navigate(fullPath)
        return
      }
    }

    // If no saved state, check if we have default state for this page
    if (hasPageDefaultState(pageName)) {
      const defaultUrl = buildDefaultPageUrl(pageName, pagePath)
      navigate(defaultUrl)
      return
    }

    // Fallback to basic navigation
    navigate(pagePath)
  }

  /**
   * Navigate to a page and save current state before leaving
   */
  const navigateAndSaveState = (pagePath: string) => {
    // Save current state before navigating
    saveCurrentPageState()

    // Navigate to the new page
    navigate(pagePath)
  }

  /**
   * Navigate to a page with default state (ignoring saved state)
   */
  const navigateToPageWithDefaultState = (pagePath: string) => {
    // Save current state before navigating
    saveCurrentPageState()

    const pageName = getPageName(pagePath)

    if (hasPageDefaultState(pageName)) {
      const defaultUrl = buildDefaultPageUrl(pageName, pagePath)
      navigate(defaultUrl)
    } else {
      navigate(pagePath)
    }
  }

  /**
   * Get the saved state for the current page
   */
  const getCurrentPageSavedState = () => {
    const pageName = getPageName(location.pathname)
    return getPageState(pageName)
  }

  /**
   * Check if current page has saved state
   */
  const hasCurrentPageSavedState = () => {
    const pageName = getPageName(location.pathname)
    return hasPageState(pageName)
  }

  /**
   * Get default state for current page
   */
  const getCurrentPageDefaultStateValue = () => {
    return getCurrentPageDefaultState(location.pathname)
  }

  /**
   * Check if current page has default state configuration
   */
  const hasCurrentPageDefaultState = () => {
    const pageName = getPageName(location.pathname)
    return hasPageDefaultState(pageName)
  }

  /**
   * Reset current page to default state
   */
  const resetCurrentPageToDefault = () => {
    const pageName = getPageName(location.pathname)

    if (hasPageDefaultState(pageName)) {
      const basePathname = `/${pageName}`
      const defaultUrl = buildDefaultPageUrl(pageName, basePathname)
      navigate(defaultUrl, { replace: true })
    }
  }

  return {
    // Navigation functions
    navigateToPage,
    navigateAndSaveState,
    navigateToPageWithDefaultState,

    // State management
    saveCurrentPageState,
    getCurrentPageSavedState,
    hasCurrentPageSavedState,

    // Default state management
    getCurrentPageDefaultStateValue,
    hasCurrentPageDefaultState,
    resetCurrentPageToDefault,

    // Default state application
    shouldApplyDefaultState,
    applyDefaultStateIfNeeded,

    // Current route info
    currentPathname: location.pathname,
    currentSearch: location.search,
    currentPageName: getPageName(location.pathname)
  }
}

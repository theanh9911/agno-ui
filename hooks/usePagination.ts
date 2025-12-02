import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useEffect } from 'react'

type UsePaginationAutoSettingsArgs<TData> = {
  currentPage: number
  totalPages?: number | null
  data?: TData[] | null
  isLoading?: boolean
  onPageChange?: (page: number) => void
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse URL params with fallback defaults
  const pageParam = searchParams.get('page')
  const parsedPage = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE
  const page =
    Number.isNaN(parsedPage) || parsedPage <= 0 ? DEFAULT_PAGE : parsedPage

  const limitParam = searchParams.get('limit')
  const parsedLimit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT
  const limit =
    Number.isNaN(parsedLimit) || parsedLimit <= 0 ? DEFAULT_LIMIT : parsedLimit

  // Update URL with new pagination params
  const updatePagination = useCallback(
    (updates: { page?: number; limit?: number }) => {
      const newSearchParams = new URLSearchParams(searchParams)

      if (updates.page !== undefined) {
        newSearchParams.set('page', String(updates.page))
      }

      if (updates.limit !== undefined) {
        newSearchParams.set('limit', String(updates.limit))
        // Reset to page 1 when limit changes
        newSearchParams.set('page', '1')
      }

      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams]
  )

  const setPage = (newPage: number) => {
    updatePagination({ page: newPage })
  }

  const setLimit = (newLimit: number) => {
    updatePagination({ limit: newLimit })
  }

  return {
    page,
    limit,
    setPage,
    setLimit
  }
}

export const usePaginationAutoSettings = <TData>({
  currentPage,
  totalPages,
  data,
  isLoading,
  onPageChange
}: UsePaginationAutoSettingsArgs<TData>) => {
  // Auto-correct pagination when:
  // 1) current page exceeds available pages (invalid URL state)
  // 2) all data is deleted (force page 1)
  // 3) deleting items leaves current page empty (go back one page)
  // Skip adjustments while loading to avoid mid-transition jumps
  useEffect(() => {
    if (!onPageChange || isLoading) return

    if (totalPages !== null && totalPages !== undefined) {
      if (totalPages === 0) {
        onPageChange(1)
        return
      }
      if (totalPages > 0 && currentPage > totalPages) {
        onPageChange(totalPages)
        return
      }
    }

    if (
      currentPage > 1 &&
      Array.isArray(data) &&
      data.length === 0 &&
      totalPages !== null &&
      totalPages !== undefined &&
      totalPages >= 0
    ) {
      onPageChange(Math.max(1, currentPage - 1))
    }
  }, [currentPage, totalPages, onPageChange, isLoading, data])
}

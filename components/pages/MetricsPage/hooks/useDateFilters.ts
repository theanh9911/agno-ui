import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { DateRange } from '@/types/globals'
import { getDateRangeFromParams } from '../utils'

export const useDateFilters = (): DateRange => {
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const monthParam = searchParams.get('month')
  const yearParam = searchParams.get('year')

  const dateFilters = useMemo(() => {
    // If URL has params, use them; otherwise use stored values
    const monthToUse = monthParam
    const yearToUse = yearParam
    return getDateRangeFromParams(monthToUse, yearToUse)
  }, [monthParam, yearParam])

  return dateFilters
}

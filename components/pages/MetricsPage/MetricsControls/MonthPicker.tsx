import { useCallback, useMemo, type FC } from 'react'

import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'

import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { MonthPickerProps } from '../types'
import {
  validateAndAdjustDate,
  formatMonthLabel,
  formatYearLabel,
  isCurrentMonth
} from '../utils'

const MonthPicker: FC<MonthPickerProps> = ({ className, onChange }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get current URL parameters
  const searchParams = new URLSearchParams(location.search)
  const month = searchParams.get('month')
  const year = searchParams.get('year')

  // Helper function to update URL parameters
  const updateUrlParams = useCallback(
    (newMonth: string, newYear: string) => {
      const newSearchParams = new URLSearchParams(location.search)
      newSearchParams.set('month', newMonth)
      newSearchParams.set('year', newYear)
      navigate(`${location.pathname}?${newSearchParams.toString()}`, {
        replace: true
      })
    },
    [location, navigate]
  )

  const currentDate = useMemo(() => new Date(), [])
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const selectedDate = useMemo(() => {
    const { date, wasAdjusted } = validateAndAdjustDate(
      month,
      year,
      currentDate
    )

    if (wasAdjusted) {
      updateUrlParams((currentMonth + 1).toString(), currentYear.toString())
    }

    return date
  }, [month, year, currentDate, currentMonth, currentYear, updateUrlParams])

  const isCurrentMonthSelected = isCurrentMonth(selectedDate, currentDate)
  const monthLabel = formatMonthLabel(selectedDate)
  const yearLabel = formatYearLabel(selectedDate)

  const selectPreviousMonth = useCallback(() => {
    const previousMonth = dayjs(selectedDate).subtract(1, 'month')

    updateUrlParams(
      (previousMonth.month() + 1).toString(),
      previousMonth.year().toString()
    )

    if (onChange) {
      onChange(previousMonth)
    }
  }, [selectedDate, updateUrlParams, onChange])

  const selectNextMonth = useCallback(() => {
    const nextMonth = dayjs(selectedDate).add(1, 'month')

    updateUrlParams(
      (nextMonth.month() + 1).toString(),
      nextMonth.year().toString()
    )

    if (onChange) {
      onChange(nextMonth)
    }
  }, [selectedDate, updateUrlParams, onChange])

  return (
    <div
      className={cn(
        'flex h-9 items-center gap-x-2 rounded-md border border-border px-3 py-2 text-xs shadow-sm',
        className
      )}
    >
      <button
        type="button"
        aria-label="Select previous month"
        onClick={selectPreviousMonth}
      >
        <Icon type="triangle-left" size="xs" className="text-muted" />
      </button>
      <Paragraph size="mono" className="w-16 select-none text-center uppercase">
        {monthLabel} {yearLabel}
      </Paragraph>
      <button
        type="button"
        aria-label="Select next month"
        onClick={selectNextMonth}
        disabled={isCurrentMonthSelected}
      >
        <Icon type="triangle-right" size="xs" className="text-muted" />
      </button>
    </div>
  )
}

export default MonthPicker

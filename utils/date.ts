import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export const getMinutes = (multiplier: number) => 60 * multiplier

export const getHours = (multiplier: number) => getMinutes(60) * multiplier

export const getDays = (multiplier: number) => getHours(24) * multiplier

let isInitialized = false

export const initDayjs = () => {
  if (!isInitialized) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('UTC')

    isInitialized = true
  }
}

import { type ValueKeyIteratee } from 'lodash'
import isArray from 'lodash/isArray'
import isDate from 'lodash/isDate'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import mapValues from 'lodash/mapValues'
import omitBy from 'lodash/omitBy'
import truncate from 'lodash/truncate'

/**
 * Lodash's `omitBy` except it does this recursively.
 */
export const omitDeepBy = (
  value: object,
  iteratee: ValueKeyIteratee<never>
) => {
  let newObj: object = value

  if (isDate(value)) {
    newObj = value
  } else if (isArray(value)) {
    newObj = value.map((v: unknown) =>
      isObject(value) ? omitDeepBy(v as object, iteratee) : v
    )
  } else if (isObject(value) && !isFunction(value)) {
    newObj = omitBy(
      mapValues(value, (v) => omitDeepBy(v, iteratee)),
      iteratee
    )
  }

  return newObj
}

/**
 * Generate a cache key based on a key and parameters, with each parameter separated by `:`.
 */
type Param = string | undefined

export const getCacheKey = (key: string, params: Param[]) => {
  const filteredParams = params.filter((param) => param != null && param !== '')
  return `${key}:${filteredParams.join(':')}`
}

export const truncateText = (text: string, maxLength: number) => {
  return truncate(text, { length: maxLength })
}

export const isEmpty = (obj: object) => Object.keys(obj).length === 0

export const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Flattens an object containing arrays into a single array
 * @param obj - Object where each property can be an array
 * @returns Flattened array of all items from the object's arrays
 */
export const flattenObjectArrays = <T>(
  obj: Record<string, T[]> | undefined
): T[] => {
  if (!obj) return []
  return Object.values(obj).flat()
}

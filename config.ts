export const BUILD_ENV = import.meta.env.VITE_BUILD_ENV ?? 'production'

export const IS_BROWSER = typeof window !== 'undefined'
export const IS_PRODUCTION = BUILD_ENV === 'production'

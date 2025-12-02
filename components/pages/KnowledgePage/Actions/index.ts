import { lazy } from 'react'

export const ContentReadEditDialog = lazy(
  () => import('./ContentReadEditDialog/ContentReadEditDialog')
)

export const ContentUploadDialog = lazy(() => import('./ContentUploadDialog'))
export const ContentUploaderSelector = lazy(
  () => import('./ContentUploadDialog/ContentUploaderSelector')
)

export * from './EditDeleteCTAs'

import React from 'react'
import ErrorBoundaryShell from '@/components/pages/ErrorBoundaryPage'
import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const error = useRouteError() as Error | undefined

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <ErrorBoundaryShell
      error={error || new Error('An unexpected error occurred')}
      resetErrorBoundary={handleReset}
    />
  )
}

export default ErrorPage

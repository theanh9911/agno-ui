import React from 'react'
import { toast as sonnerToast } from 'sonner'
import { CustomToast } from './toast'
import { type CustomToastProps } from './types'

type ToastOptions = Omit<CustomToastProps, 'variant' | 'onClose'>

// Helper function to generate unique ID only when needed
const getToastId = (variant: string, providedId?: string) => {
  return providedId ?? `${variant}-${Date.now()}`
}

export const toast = {
  error: (options: ToastOptions) => {
    const toastId = getToastId('error', options.id)

    return sonnerToast.custom(
      () =>
        React.createElement(CustomToast, {
          variant: 'error',
          title: options.title,
          description: options.description,
          action: options.action,
          onClose: () => sonnerToast.dismiss(toastId),
          showCloseButton: false
        }),
      {
        duration: options.duration,
        id: toastId
      }
    )
  },

  success: (options: ToastOptions) => {
    const toastId = getToastId('success', options.id)

    return sonnerToast.custom(
      () =>
        React.createElement(CustomToast, {
          variant: 'success',
          title: options.title,
          description: options.description,
          action: options.action,
          onClose: () => sonnerToast.dismiss(toastId),
          showCloseButton: options.showCloseButton
        }),
      {
        duration: options.duration,
        id: toastId
      }
    )
  },

  loading: (options: ToastOptions) => {
    const toastId = getToastId('loading', options.id)

    return sonnerToast.custom(
      () =>
        React.createElement(CustomToast, {
          variant: 'loading',
          title: options.title,
          description: options.description,
          action: options.action,
          onClose: () => sonnerToast.dismiss(toastId),
          showCloseButton: options.showCloseButton
        }),
      {
        duration: options.duration,
        id: toastId
      }
    )
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  }
}

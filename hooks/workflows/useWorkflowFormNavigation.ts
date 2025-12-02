import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { WorkflowFormData } from '@/schema/workflowSchema'

interface UseWorkflowFormNavigationProps {
  form: UseFormReturn<WorkflowFormData>
  onRun?: (data: WorkflowFormData) => void
}

export function useWorkflowFormNavigation({
  form,
  onRun
}: UseWorkflowFormNavigationProps) {
  const focusNextField = useCallback(
    (currentElement: HTMLElement) => {
      const formElement = currentElement.closest('form')
      if (!formElement) return

      const focusableElements = formElement.querySelectorAll<HTMLElement>(
        'input:not([type="hidden"]):not([type="button"]):not([type="submit"]), textarea'
      )

      const focusableArray = Array.from(focusableElements)
      const currentIndex = focusableArray.indexOf(currentElement)

      if (currentIndex === -1) return

      const nextElement = focusableArray[currentIndex + 1]

      if (nextElement) {
        nextElement.focus()
        if (nextElement.tagName === 'TEXTAREA') {
          const textarea = nextElement as HTMLTextAreaElement
          setTimeout(() => {
            textarea.setSelectionRange(
              textarea.value.length,
              textarea.value.length
            )
          }, 0)
        }
      } else {
        if (form.formState.isValid && onRun) {
          onRun(form.getValues())
        } else {
          document.dispatchEvent(new CustomEvent('workflow-validate'))
        }
      }
    },
    [form, onRun]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement

        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          if (form.formState.isValid && onRun) {
            onRun(form.getValues())
          } else {
            document.dispatchEvent(new CustomEvent('workflow-execute'))
          }
          return
        }

        if (target.tagName === 'TEXTAREA' && e.shiftKey) {
          return
        }

        e.preventDefault()
        focusNextField(target)
      }
    },
    [form, onRun, focusNextField]
  )

  return { handleKeyDown, focusNextField }
}

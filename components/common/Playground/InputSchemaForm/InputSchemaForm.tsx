// So we are gonna refactor this component as it currenlty only supports workflows, but we want to support all types, aka agents and teams.
// Progress:
// - We are rending form for agents, need to support submit now.

import { memo, useEffect, useMemo } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import WorkflowFormFields from '@/components/pages/WorkflowsPage/MainPage/FormComponents/WorkflowFormFields'

import { useWorkflowsStore } from '@/stores/workflowsStore'
import {
  createInputSchema,
  generateFormDefaults,
  InputSchema,
  type InputSchemaData
} from './schema'

import { useWorkflowFormNavigation } from '@/hooks/workflows/useWorkflowFormNavigation'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { usePlaygroundStore } from '@/stores/playground'

/**
 * Main workflow form component for executing workflows with dynamic form fields
 * Integrates header, form fields, and run button components
 */
interface InputSchemaFormProps {
  onRun?: (data: InputSchemaData) => void
  inputSchema: InputSchema | undefined
  inputMessage: string
}
const InputSchemaForm = memo<InputSchemaFormProps>(
  ({ onRun, inputSchema, inputMessage }) => {
    const { setIsFormValid, setFormData } = useWorkflowsStore()
    const { setInputMessage } = usePlaygroundStore()
    const { session } = usePlaygroundQueries()

    if (!inputSchema) return null

    // Generate dynamic form schema based on workflow input schema
    const formSchema = useMemo(() => {
      return createInputSchema(inputSchema)
    }, [inputSchema])

    // Generate default values for form fields
    const defaultValues: InputSchemaData = useMemo(() => {
      const defaults = generateFormDefaults(inputSchema) as InputSchemaData
      if (!inputMessage) return defaults
      try {
        const parsed = JSON.parse(inputMessage) as InputSchemaData
        // Only reuse if the keys match the current schema; otherwise use defaults
        const parsedKeys = Object.keys(parsed as Record<string, unknown>).sort()
        const defaultKeys = Object.keys(
          defaults as Record<string, unknown>
        ).sort()
        const sameShape =
          parsedKeys.length === defaultKeys.length &&
          parsedKeys.every((k, i) => k === defaultKeys[i])
        return sameShape ? parsed : defaults
      } catch {
        return defaults
      }
    }, [inputSchema, inputMessage])

    const form = useForm<InputSchemaData>({
      resolver: zodResolver(formSchema),
      defaultValues,
      mode: 'onChange'
    })

    const { handleKeyDown, focusNextField } = useWorkflowFormNavigation({
      form,
      onRun
    })

    // Auto-focus on the first form field when the workflow schema changes
    useEffect(() => {
      const formElement = document.querySelector('form')
      if (formElement) {
        const focusable = formElement.querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([type="button"]):not([type="submit"]), textarea'
        )
        focusable?.focus()
      }
    }, [inputSchema])

    // Reset form when schema, defaults, or session changes to ensure clean state
    useEffect(() => {
      form.reset(defaultValues)
    }, [form, defaultValues, session])

    // Watch form data and validation state changes to sync with global store
    // - Updates setIsFormValid in workflows store for WorkflowRunButton to enable/disable execution
    // - Updates setFormData in workflows store with current form values for WorkflowRunButton's getInputData
    // - Subscription ensures real-time updates as user types or form validation changes
    useEffect(() => {
      const subscription = form.watch((data) => {
        const isValid = form.formState.isValid
        setIsFormValid(isValid)
        setFormData(data as InputSchemaData)
        setInputMessage(JSON.stringify(data))
      })
      return () => subscription.unsubscribe()
    }, [form, setIsFormValid, setFormData])

    // Initial validation state sync
    useEffect(() => {
      setIsFormValid(form.formState.isValid)
    }, [form.formState.isValid, setIsFormValid])

    // Listen for external validation requests and trigger form validation
    useEffect(() => {
      const handleValidate = () => {
        void form.trigger(undefined, { shouldFocus: true })
      }
      document.addEventListener('workflow-validate', handleValidate)
      return () => {
        document.removeEventListener('workflow-validate', handleValidate)
      }
    }, [form])

    // Listen for next field navigation from TagInput
    useEffect(() => {
      const handleNextField = (e: CustomEvent) => {
        if (e.detail?.currentElement) {
          focusNextField(e.detail.currentElement)
        }
      }

      document.addEventListener(
        'workflow-next-field',
        handleNextField as EventListener
      )
      return () => {
        document.removeEventListener(
          'workflow-next-field',
          handleNextField as EventListener
        )
      }
    }, [focusNextField])

    // Form submission is handled by WorkflowRunButton component, not here
    // This onSubmit is intentionally empty as the actual workflow execution
    // happens through the WorkflowRunButton's handleRun method which gets
    // form data via getInputData from the workflows store
    return (
      <div className="flex size-full max-h-[38vh] flex-col items-center overflow-y-auto">
        <div className="flex w-full flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={onRun ? form.handleSubmit(onRun) : undefined}
              onKeyDown={handleKeyDown}
              className="flex w-full flex-col gap-y-2"
            >
              <WorkflowFormFields
                workflowSchema={inputSchema}
                control={form.control}
              />
            </form>
          </Form>
        </div>
      </div>
    )
  }
)

InputSchemaForm.displayName = 'InputSchemaForm'

export default InputSchemaForm

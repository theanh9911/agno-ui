import { useState, useCallback, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import EnvironmentSelector from './EnvironmentSelector'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import Paragraph from '@/components/ui/typography/Paragraph'
import AppCard from '@/components/ui/AppCard'
import { TagInput } from '../../TagControls'
import DocLink from '../DocLink'

import { useOSQuery, useAddOS, useUpdateOSDetails } from '@/api/hooks'
import { useBillingStatus } from '@/api/hooks/queries/billing'
import { useBilling } from '@/providers/BillingProvider'
import { ProductType } from '@/api/generated'
import { useOSStore } from '@/stores/OSStore'
import { DOC_LINKS } from '@/docs'
import { AddOSEndpointPayload } from '@/types/os'
import { osConnectionSchema, normalizeEndpointUrl } from './schema'
import z from 'zod'
import { OSCreateConnectDialogModeType } from '@/types/os'
import { logError } from '@/utils/error'
import { UpgradeCard } from '@/components/ui/UpgradeCard'
import { useDialog } from '@/providers/DialogProvider'
import Icon from '@/components/ui/icon'
import { EnvironmentProtocol } from '../types'
import { ENVIRONMENT } from '@/constants'
import { BILLING_MESSAGES } from '@/constants/billing'
import { useInvalidateOSStatus } from '@/hooks/os/useInvalidateOSStatus'

const osConnectBenefits = [
  { text: '1 live AgentOS connection' },
  { text: 'Role & permission control' },
  { text: '3 Free member invites' },
  { text: 'Shared AgentOS access' }
]

type EndpointFormData = Omit<AddOSEndpointPayload, 'org_id'>
export type OSConnectionFormData = z.infer<typeof osConnectionSchema>

const DEFAULT_FORM_VALUES: OSConnectionFormData = {
  endpoint_url: '',
  name: '',
  tags: [],
  environment: ENVIRONMENT.LOCAL
}

interface OSConnectionFormProps {
  currentMode: OSCreateConnectDialogModeType
  initialMode: OSCreateConnectDialogModeType
  editingOS?: {
    id?: string | null
    name?: string | null
    endpoint_url?: string | null
    tags?: string[]
    is_remote: boolean
  } | null
}

const OSConnectionForm = ({
  currentMode,
  initialMode,
  editingOS
}: OSConnectionFormProps) => {
  const { data: osList } = useOSQuery()
  const { data: billing } = useBillingStatus()
  const billingProvider = useBilling()
  const addOSMutation = useAddOS()
  const { osBeingEdited } = useOSStore()
  const { closeDialog } = useDialog()
  const updateOSMutation = useUpdateOSDetails()
  const { invalidateOSStatus } = useInvalidateOSStatus()
  const setCurrentOS = useOSStore((state) => state.setCurrentOS)
  const setAuthStatus = useOSStore((state) => state.setAuthStatus)
  const currentOS = useOSStore((state) => state.currentOS)
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeTeaser, setShowUpgradeTeaser] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeParams, setUpgradeParams] = useState<{
    name: string
    url: string
    tags: string[]
  } | null>(null)

  const isEditing = currentMode === OSCreateConnectDialogModeType.EDIT

  const initialDefaultValues = useMemo<OSConnectionFormData>(() => {
    const source = editingOS || osBeingEdited || currentOS
    if (isEditing && source) {
      return {
        endpoint_url: source.endpoint_url || '',
        name: source.name || '',
        tags: source.tags || [],
        environment: source.is_remote ? 'live' : 'local'
      }
    }
    return DEFAULT_FORM_VALUES
  }, [isEditing, editingOS, osBeingEdited, currentOS])

  const form = useForm<OSConnectionFormData>({
    resolver: zodResolver(osConnectionSchema),
    mode: 'onChange',
    defaultValues: initialDefaultValues
  })
  const { isDirty } = form.formState

  const resetForm = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES)
  }, [form])

  const environment = useWatch({ control: form.control, name: 'environment' })
  const liveCount = (osList || []).filter((o) => o.is_remote).length
  const remoteOsProduct = billing?.products?.find(
    (p) => p.product_type === ProductType.REMOTE_OS
  )
  const hasRemoteSlot = (remoteOsProduct?.quantity || 0) > liveCount

  useEffect(() => {
    if (isEditing) {
      const source = editingOS || osBeingEdited || currentOS
      if (source) {
        const data: OSConnectionFormData = {
          endpoint_url: source.endpoint_url || '',
          name: source.name || '',
          tags: source.tags || [],
          environment: source.is_remote ? 'live' : 'local'
        }
        form.reset(data)
        form.clearErrors('environment')
        return
      }
    }
    if (!isEditing) {
      resetForm()
      form.setValue('environment', 'local', { shouldDirty: false })
    }
  }, [isEditing, form, resetForm, osBeingEdited, currentOS])

  const handleCheckout = async () => {
    setIsUpgrading(true)
    try {
      await billingProvider.startCheckout({
        productType: ProductType.STARTER_BASE,
        successPayload: {
          from: 'os-connect',
          'os-name':
            upgradeParams?.name || (form.getValues('name') || '').trim(),
          'os-url':
            upgradeParams?.url ||
            normalizeEndpointUrl(form.getValues('endpoint_url') || ''),
          'os-tags': (upgradeParams?.tags || form.getValues('tags') || []).join(
            ','
          )
        }
      })
    } catch {
      setIsUpgrading(false)
    }
  }

  // Placeholder adjusts based on environment selection
  const endpointPlaceholder =
    environment === 'live' ? 'https://domain.com' : 'http://localhost:8000'

  // Re-validate URL when environment changes because schema logic depends on it
  // but only after the user has interacted with the field (value/touched/dirty)
  useEffect(() => {
    const endpointRaw = form.getValues('endpoint_url')?.trim() || ''
    const endpointState = form.getFieldState('endpoint_url')
    const hasInteraction =
      endpointRaw.length > 0 || endpointState.isDirty || endpointState.isTouched
    if (!hasInteraction) return
    form.trigger('endpoint_url')
  }, [environment])

  const handleSubmit = useCallback(
    async (data: OSConnectionFormData) => {
      setIsLoading(true)
      try {
        // Only gate on upgrade when creating, not when editing
        if (
          !isEditing &&
          data.environment === 'live' &&
          !billingProvider.isPro
        ) {
          const name = (data.name || '').trim()
          const endpoint = normalizeEndpointUrl(data.endpoint_url)
          const tags = data.tags || []
          setUpgradeParams({ name, url: endpoint, tags })
          setShowUpgradeTeaser(true)
          return
        }
        const normalizedEndpoint = normalizeEndpointUrl(data.endpoint_url)

        const payload: EndpointFormData = {
          endpoint_url: normalizedEndpoint,
          name: data.name,
          tags: data.tags || []
        }

        // Determine the current AgentOS being edited (if any)
        const editingSource =
          editingOS || osBeingEdited || (isEditing ? currentOS : null)
        const editingId = editingSource?.id || null

        if (isEditing && editingId) {
          const updatedOS = await updateOSMutation.mutateAsync({
            osId: editingId,
            payload
          })

          if (currentOS?.id === updatedOS.id) {
            // Check if endpoint changed before updating current OS
            const endpointChanged =
              editingSource?.endpoint_url !== normalizedEndpoint

            // Update the OS details
            setCurrentOS(updatedOS)

            // Only invalidate OS status if endpoint URL changed
            // Otherwise just updating name/tags doesn't need health recheck
            if (endpointChanged) {
              requestAnimationFrame(() => {
                invalidateOSStatus()
              })
            }
          }
          closeDialog()
          setOSBeingEdited(null)
        } else {
          const newOS = await addOSMutation.mutateAsync({
            requestBody: payload
          })

          if (newOS) {
            setCurrentOS(newOS)
          }
          closeDialog()
        }
      } catch (error) {
        logError(error as Error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      osList,
      isEditing,
      osBeingEdited,
      addOSMutation,
      updateOSMutation,
      setCurrentOS,
      setAuthStatus,
      currentOS,
      editingOS,
      billing,
      closeDialog,
      invalidateOSStatus
    ]
  )

  const setOSBeingEdited = useOSStore((state) => state.setOSBeingEdited)

  const handleDialogClose = () => {
    closeDialog()
    resetForm()
    setOSBeingEdited(null)
  }

  return (
    <>
      {showUpgradeTeaser ? (
        <UpgradeCard
          title="Upgrade to connect your Live AgentOS"
          description="Upgrade to unlock multi-user access, role management, and a shared live AgentOS"
          benefits={osConnectBenefits}
          productType={ProductType.STARTER_BASE}
          successPayload={{
            from: 'os-connect',
            'os-name':
              upgradeParams?.name || (form.getValues('name') || '').trim(),
            'os-url':
              upgradeParams?.url ||
              normalizeEndpointUrl(form.getValues('endpoint_url') || ''),
            'os-tags': (
              upgradeParams?.tags ||
              form.getValues('tags') ||
              []
            ).join(',')
          }}
          hideActions
        />
      ) : (
        <AppCard
          title={
            <div className="flex w-full items-center justify-between">
              <Paragraph size="label">
                {isEditing ? 'EDIT YOUR AgentOS' : 'CONNECT YOUR AgentOS'}
              </Paragraph>
              <DocLink link={DOC_LINKS.agentOS.connectOS} />
            </div>
          }
          description={{
            content: (
              <Form {...form}>
                <form
                  id="os-connect-form"
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex w-full flex-col gap-4"
                >
                  <>
                    <FormItem className="flex flex-col items-start gap-2">
                      <EnvironmentSelector
                        value={environment as EnvironmentProtocol}
                        className={
                          isEditing
                            ? 'pointer-events-none opacity-60'
                            : undefined
                        }
                        isPro={billingProvider.isPro}
                        hasRemoteSlot={hasRemoteSlot}
                        remoteOsMonthlyCostCents={remoteOsProduct?.monthly_cost}
                        currency={(billing?.currency || 'USD').toUpperCase()}
                        onChange={
                          isEditing
                            ? () => {}
                            : (v) =>
                                form.setValue('environment', v, {
                                  shouldDirty: true,
                                  shouldValidate: true
                                })
                        }
                      />
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="endpoint_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">
                            Endpoint URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={endpointPlaceholder}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your AgentOS name"
                              className="bg-transparent"
                              {...field}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary" optional>
                            TAGS
                          </FormLabel>
                          <TagInput
                            tags={field.value || []}
                            onTagsChange={field.onChange}
                            placeholder="Add tags to make your AgentOS easier to spot"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                </form>
              </Form>
            )
          }}
        />
      )}

      {showUpgradeTeaser && (
        <DialogFooter>
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            onClick={() => setShowUpgradeTeaser(false)}
            disabled={isUpgrading}
          >
            BACK
          </Button>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isUpgrading}
          >
            {isUpgrading ? 'UPGRADING...' : BILLING_MESSAGES.UPGRADE_TO_STARTER}
          </Button>
        </DialogFooter>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          !showUpgradeTeaser &&
          billingProvider.isPro &&
          !billingProvider.hasAvailableRemoteSlot(liveCount) &&
          environment === 'live'
            ? 'max-h-20 opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-secondary p-2">
          <Icon type="info" size="xs" className="shrink-0 text-primary" />
          <p className="text-sm text-primary">
            Connecting a new Live AgentOS will add an additional $
            {remoteOsProduct?.monthly_cost
              ? Math.round(remoteOsProduct.monthly_cost / 100)
              : 95}{' '}
            to your monthly bill
          </p>
        </div>
      </div>

      {!showUpgradeTeaser && (
        <DialogFooter>
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            onClick={handleDialogClose}
            disabled={isLoading}
          >
            {isEditing ||
            initialMode === OSCreateConnectDialogModeType.CONNECT ||
            initialMode === OSCreateConnectDialogModeType.EDIT
              ? 'Cancel'
              : 'Skip and connect later'}
          </Button>
          <Button
            className="w-full"
            type="submit"
            form="os-connect-form"
            disabled={isLoading || (isEditing && !isDirty)}
          >
            {isLoading
              ? `${isEditing ? 'Updating' : 'Connecting'}...`
              : isEditing
                ? 'UPDATE'
                : 'CONNECT'}
          </Button>
        </DialogFooter>
      )}
    </>
  )
}

export default OSConnectionForm

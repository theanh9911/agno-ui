import React, { createContext, useContext, useMemo } from 'react'
import { useBillingStatus } from '@/api/hooks/queries/billing'
import { ProductType, OrganizationType } from '@/api/generated'
import { useCreateStripeCheckoutSession } from '@/api/hooks/mutations/billing'
import { useCreateBillingPortalSession } from '@/api/hooks/mutations/billing'

type BillingContextValue = {
  isLoading: boolean
  isPro: boolean
  currency: string
  totalMonthly: number
  products: Record<string, number>
  hasAvailableRemoteSlot: (liveCount: number) => boolean
  hasAvailableSeatSlot: (currentMemberCount: number) => boolean
  startCheckout: (args: {
    productType: ProductType
    successPayload?: Record<string, string>
  }) => Promise<void>
  openPortal: (returnUrl?: string) => Promise<void>
}

const BillingContext = createContext<BillingContextValue | null>(null)

export const BillingProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { data: billing, isLoading } = useBillingStatus()

  const { mutateAsync: createCheckout } = useCreateStripeCheckoutSession()
  const { mutateAsync: createPortal } = useCreateBillingPortalSession()

  const value = useMemo<BillingContextValue>(() => {
    const currency = (billing?.currency || 'USD').toUpperCase()
    const totalMonthly = (billing?.total_monthly_cost || 0) / 100
    const isPro =
      !!billing?.has_subscription ||
      billing?.organization_tier === OrganizationType.CUSTOM
    const products: Record<string, number> = {}
    for (const p of billing?.products || []) {
      products[p.product_type] = p.quantity
    }
    const hasAvailableRemoteSlot = (liveCount: number) => {
      const hasStarter = products[ProductType.STARTER_BASE] || 0
      const allowed = hasStarter > 0 && !liveCount
      return allowed
    }

    const hasAvailableSeatSlot = (currentMemberCount: number) => {
      const allowed = products[ProductType.ORG_SEAT] || 0
      return allowed > currentMemberCount
    }

    const startCheckout = async ({
      productType,
      successPayload = {}
    }: {
      productType: ProductType
      successPayload?: Record<string, string>
    }) => {
      const url = new URL(`${window.location.origin}/`)

      if (Object.keys(successPayload).length > 0) {
        const encodedPayload = btoa(
          encodeURIComponent(JSON.stringify(successPayload))
        )
        url.searchParams.set('p', encodedPayload)
      }
      const { checkout_url } = await createCheckout({
        product_type: productType,
        success_url: url.toString(),
        cancel_url: window.location.href
      })

      window.location.assign(checkout_url)
    }

    const openPortal = async (returnUrl?: string) => {
      const { url } = await createPortal({
        returnUrl: returnUrl || window.location.href
      })
      window.location.assign(url)
    }

    return {
      isLoading,
      isPro,
      currency,
      totalMonthly,
      products,
      hasAvailableRemoteSlot,
      hasAvailableSeatSlot,
      startCheckout,
      openPortal
    }
  }, [billing, isLoading, createCheckout, createPortal])

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  )
}

export const useBilling = () => {
  const ctx = useContext(BillingContext)
  if (!ctx) throw new Error('useBilling must be used within BillingProvider')
  return ctx
}

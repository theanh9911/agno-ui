import { useQuery } from '@tanstack/react-query'
import { BillingService, type BillingStatusResponse } from '@/api/generated'
import { CACHE_KEYS } from '@/constants'
import { useCurrentOrganization } from '@/api/hooks/queries/organization/useCurrentOrganization'

export const useBillingStatus = () => {
  const { data: org } = useCurrentOrganization()
  const orgId = org?.id ?? null

  return useQuery<BillingStatusResponse | null>({
    queryKey: CACHE_KEYS.BILLING_STATUS(orgId),
    queryFn: async () => {
      return await BillingService.orgBillingDashboard()
    },
    enabled: !!orgId
  })
}

export const useBillingStatusPolling = (options?: { enabled?: boolean }) => {
  const { data: org } = useCurrentOrganization()
  const orgId = org?.id ?? null

  return useQuery<BillingStatusResponse | null>({
    queryKey: CACHE_KEYS.BILLING_STATUS(orgId),
    queryFn: async () => {
      return await BillingService.orgBillingDashboard()
    },
    enabled: options?.enabled ?? true,
    staleTime: 0,
    gcTime: 0,
    retry: false,

    refetchInterval: (query) => {
      // Stop polling if we have subscription data
      if (query.state.data?.has_subscription) {
        return false
      }
      return 300
    }
  })
}

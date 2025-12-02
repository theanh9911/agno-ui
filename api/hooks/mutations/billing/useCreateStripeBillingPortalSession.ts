import { useMutation } from '@tanstack/react-query'
import { BillingService, type BillingPortalResponse } from '@/api/generated'
import { toast } from '@/components/ui/toast'

export const useCreateBillingPortalSession = () => {
  return useMutation<BillingPortalResponse, Error, { returnUrl: string }>({
    mutationFn: async ({ returnUrl }: { returnUrl: string }) => {
      return await BillingService.orgBillingPortal({ returnUrl })
    },
    onError: (err) => {
      // Todo(RS): Refine error handling
      toast.error({
        description: err.message || 'Failed to open billing portal'
      })
    }
  })
}

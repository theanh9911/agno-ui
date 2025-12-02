import { useMutation } from '@tanstack/react-query'
import {
  BillingService,
  type CheckoutRequest,
  type CheckoutResponse
} from '@/api/generated'
import { toast } from '@/components/ui/toast'

export const useCreateStripeCheckoutSession = () => {
  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: async (payload: CheckoutRequest) => {
      return await BillingService.orgBillingCheckout({
        requestBody: payload
      })
    },
    onError: (err) => {
      // Todo(RS): Refine error handling
      toast.error({
        description: err.message || 'Failed to start checkout'
      })
    }
  })
}

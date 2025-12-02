import { useCallback, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUser } from '@/api/hooks/queries'
import { useCreateOrganization } from '@/api/hooks/mutations/useCreateOrganization'
import React from 'react'
import { useOnboardingStore } from '@/stores/OnboardingStore'
import { useChangeOrganization } from '@/api/hooks'

const formSchema = z.object({
  orgName: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.'
  })
})
interface CreateOrganizationProps {
  showSuccessToast?: boolean
}
export default function CreateOrganization({
  showSuccessToast = true
}: CreateOrganizationProps) {
  const { data } = useUser()
  const user = data?.user
  const createOrganization = useCreateOrganization({
    showSuccessToast: showSuccessToast
  })
  const changeOrganizationMutation = useChangeOrganization()

  const navigate = useNavigate()
  const { setOrgName } = useOnboardingStore()

  const defaultOrgName = `${user?.name?.split(' ')[0] || 'My Organization'}`

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: defaultOrgName
    }
  })

  // Watch form values and update store
  const watchedValues = form.watch()

  useEffect(() => {
    setOrgName(watchedValues.orgName || null)
  }, [watchedValues.orgName, setOrgName])

  const handleCreateOrganization = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const response = await createOrganization.mutateAsync({
        name: values.orgName
      })

      if (response) {
        await changeOrganizationMutation.mutateAsync(response.id)
      }
    },
    [createOrganization, navigate]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateOrganization)}
        className="w-full space-y-[1rem]"
      >
        <FormField
          control={form.control}
          name="orgName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Organization Name</FormLabel>
              <FormControl>
                <Input
                  error={!!form.formState.errors.orgName}
                  placeholder={defaultOrgName}
                  className="bg-transparent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            createOrganization.isPending || !form.watch('orgName')?.trim()
          }
        >
          Get Started
        </Button>
      </form>
    </Form>
  )
}

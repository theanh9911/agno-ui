import { useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useCreateOrganization } from '@/api/hooks/mutations/useCreateOrganization'
import { useChangeOrganization } from '@/api/hooks'
import { useDialog } from '@/providers/DialogProvider'

const formSchema = z.object({
  orgName: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.'
  })
})

type FormValues = z.infer<typeof formSchema>

const CreateOrganizationModal = () => {
  const { closeDialog } = useDialog()
  const changeOrganizationMutation = useChangeOrganization()

  const createOrganization: ReturnType<typeof useCreateOrganization> =
    useCreateOrganization()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: ''
    },
    mode: 'onChange',
    delayError: 500
  })

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const response = await createOrganization.mutateAsync({
        name: values.orgName
      })

      if (response) {
        await changeOrganizationMutation.mutateAsync(response.id)
      }
      closeDialog()
    },

    [createOrganization, changeOrganizationMutation, closeDialog]
  )

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new organization</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase">Organization Name</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      error={!!form.formState.errors.orgName}
                      placeholder="Your organization's name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || createOrganization.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export default CreateOrganizationModal

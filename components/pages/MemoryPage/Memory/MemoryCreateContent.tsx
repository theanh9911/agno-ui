import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '@/components/common/TagControls'
import Icon from '@/components/ui/icon'
import { Memory, MemoryDialogModeType } from '@/types/memory'
import { useState, useCallback } from 'react'
import { useUpdateMemory, useCreateMemory } from '@/hooks/memory'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useDialog } from '@/providers/DialogProvider'

interface MemoryCreateContentProps {
  memory?: Memory
  mode: MemoryDialogModeType.CREATE | MemoryDialogModeType.EDIT
  userId?: string
}

export function MemoryCreateContent({
  memory,
  mode,
  userId
}: MemoryCreateContentProps) {
  const { closeDialog } = useDialog()
  const [editedTopics, setEditedTopics] = useState<string[]>(
    memory?.topics || []
  )

  const memoryFormSchema = z.object({
    memory: z.string().min(1, 'Memory content is required'),
    topics: z.array(z.string()).optional(),
    userId: z.string().min(1, { message: 'User ID is required' }).trim()
  })

  const updateMemoryMutation = useUpdateMemory()
  const createMemoryMutation = useCreateMemory()

  const form = useForm<z.infer<typeof memoryFormSchema>>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      memory: memory?.memory || '',
      topics: memory?.topics || [],
      userId: userId || ''
    }
  })

  const { isDirty, isValid } = form.formState

  const handleTopicsChange = useCallback(
    (newTopics: string[]) => {
      setEditedTopics(newTopics)
      form.setValue('topics', newTopics, { shouldDirty: true })
    },
    [form]
  )

  const onSubmit = useCallback(
    async (values: z.infer<typeof memoryFormSchema>) => {
      const trimmedMemory = values.memory.trim()
      const filteredTopics = editedTopics.filter(
        (topic) => topic.trim().length > 0
      )

      const userIdToUse =
        mode === MemoryDialogModeType.CREATE
          ? userId || values.userId
          : memory?.user_id

      const payload = {
        memory: trimmedMemory,
        topics: filteredTopics.length > 0 ? filteredTopics : undefined,
        user_id: userIdToUse
      }

      if (mode === MemoryDialogModeType.CREATE) {
        createMemoryMutation.mutate(payload)
      } else if (mode === MemoryDialogModeType.EDIT) {
        if (!memory?.memory_id) return
        updateMemoryMutation.mutate({
          memoryId: memory.memory_id,
          payload
        })
      }

      closeDialog()
    },
    [
      editedTopics,
      userId,
      mode,
      createMemoryMutation,
      memory?.memory_id,
      updateMemoryMutation,
      closeDialog
    ]
  )

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader className="flex flex-row justify-between gap-y-2 pr-1">
        <DialogTitle>
          {mode === MemoryDialogModeType.CREATE
            ? 'Create Memory'
            : 'Edit Memory'}
        </DialogTitle>
        <Button
          variant="icon"
          onClick={closeDialog}
          icon="close"
          size="xs"
          aria-label="Close dialog"
        />
      </DialogHeader>
      <div className="space-y-6">
        <Form {...form}>
          <form
            id="memory-details-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {!userId && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Icon type="user" size={16} color="muted" />
                      <FormLabel>User ID</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        className="px-3 py-2"
                        placeholder="Enter user ID"
                        error={!!form.formState.errors.userId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Icon type="align-left" size={16} color="muted" />
                    <FormLabel>Content</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-20 resize-none px-3 py-2 pr-10"
                      rows={2}
                      error={!!form.formState.errors.memory}
                      placeholder={
                        mode === MemoryDialogModeType.CREATE
                          ? 'Enter memory content'
                          : memory?.memory || ''
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          if (isDirty && isValid) form.handleSubmit(onSubmit)()
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon type="tags" size={16} color="muted" />
                <FormLabel optional>Topics</FormLabel>
              </div>

              <TagInput
                tags={editedTopics}
                onTagsChange={handleTopicsChange}
                placeholder="Type your topic and press enter to add it to the topic list"
              />
            </div>

            <div className="flex w-full flex-row gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={closeDialog}
                className="h-9 w-full"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                type="submit"
                form="memory-details-form"
                className="h-9 w-full"
                disabled={
                  updateMemoryMutation.isPending ||
                  createMemoryMutation.isPending ||
                  (mode === MemoryDialogModeType.EDIT && !isDirty)
                }
              >
                {updateMemoryMutation.isPending ||
                createMemoryMutation.isPending
                  ? 'Saving...'
                  : mode === MemoryDialogModeType.CREATE
                    ? 'Create'
                    : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  )
}

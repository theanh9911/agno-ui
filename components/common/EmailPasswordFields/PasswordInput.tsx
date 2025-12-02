import { useState } from 'react'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

interface PasswordInputProps {
  label: string
  field: ControllerRenderProps<FieldValues, string>
  isLoading?: boolean
  onErrorClear?: () => void
  placeholder?: string
  error?: boolean
}

const PasswordInput = ({
  label,
  field,
  isLoading = false,
  onErrorClear,
  placeholder = 'Your password',
  error = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormItem className="text-left">
      <FormLabel className="text-primary">{label}</FormLabel>
      <FormControl>
        <div className="flex w-full flex-col gap-2">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e)
                if (onErrorClear) onErrorClear()
              }}
              disabled={isLoading}
              error={error}
            />
            <Button
              type="button"
              size="icon"
              variant="icon"
              onClick={(e) => {
                e.preventDefault()
                setShowPassword(!showPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              disabled={isLoading}
            >
              {!showPassword ? (
                <Icon type="eye-closed" size={16} color="muted" />
              ) : (
                <Icon type="eye-open" size={16} color="muted" />
              )}
            </Button>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default PasswordInput

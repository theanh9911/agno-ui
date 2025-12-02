import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import Icon, { IconType } from '@/components/ui/icon'

import { ToolCall, UserInputField } from '@/types/Agent'
import Paragraph from '@/components/ui/typography/Paragraph'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { cn } from '@/utils/cn'
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'
import { PARAGRAPH_SIZES } from '@/components/ui/typography/Paragraph/constants'
import { usePlaygroundStore } from '@/stores/playground/PlaygroundStore'
import { SquareCheckbox } from '@/components/ui/square-checkbox'

interface DynamicHITLComponentProps {
  dynamicContent?: string
  tools: ToolCall[]
  onUserInputSubmit?: (toolCallId: string, values: ToolCall[]) => void
  isLoading?: boolean
  disableHitlForm?: boolean
}
interface ToolInputFieldProps {
  field: UserInputField
  toolCallId: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

const InputFieldWrapper: React.FC<{
  fieldKey: string
  field: UserInputField
  children: React.ReactNode
}> = ({ fieldKey, field, children }) => {
  return (
    <div
      key={fieldKey}
      className={cn(
        'space-y-2',
        field.field_type === 'bool' || field.field_type === 'boolean'
          ? 'flex h-full w-full items-start justify-between gap-4'
          : ''
      )}
    >
      <Label
        htmlFor={fieldKey}
        className={cn('uppercase text-muted', PARAGRAPH_SIZES.label)}
      >
        {field.description}
      </Label>
      {children}
    </div>
  )
}

const ToolInputField: React.FC<ToolInputFieldProps> = ({
  field,
  toolCallId,
  value,
  onChange,
  disabled
}) => {
  const fieldKey = `${toolCallId}-${field.name}`

  return (
    <InputFieldWrapper fieldKey={fieldKey} field={field}>
      {field.field_type === 'bool' || field.field_type === 'boolean' ? (
        <SquareCheckbox
          id={fieldKey}
          checked={value === 'true'}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')}
        />
      ) : (
        <Input
          id={fieldKey}
          type={
            field.field_type === 'int' || field.field_type === 'number'
              ? 'number'
              : 'text'
          }
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.name}`}
          className="w-full"
        />
      )}
    </InputFieldWrapper>
  )
}

const DynamicHITLComponent: React.FC<DynamicHITLComponentProps> = ({
  dynamicContent,
  tools,
  onUserInputSubmit,
  isLoading = false,
  disableHitlForm = false
}) => {
  const {
    userInputValues,
    setUserInputValues,
    toolChoices,
    setToolChoices,
    toolRejectionReasons,
    setToolRejectionReasons
  } = usePlaygroundStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    toolCallId: string,
    fieldName: string,
    value: string
  ) => {
    setUserInputValues((prev) => {
      const newValues: Record<string, Record<string, string>> = { ...prev }
      if (!newValues[toolCallId]) {
        newValues[toolCallId] = {}
      }
      newValues[toolCallId][fieldName] = value
      return newValues
    })
  }

  const handleToolChoice = (
    toolCallId: string,
    action: 'confirm' | 'reject'
  ) => {
    setToolChoices({
      ...toolChoices,
      [toolCallId]: {
        tool_call_id: toolCallId,
        action,
        rejection_reason:
          action === 'reject' ? toolRejectionReasons[toolCallId] : undefined
      }
    })
  }

  const handleSendChoices = async () => {
    setIsSubmitting(true)
    const updatedTools = tools.map((tool) => {
      if (tool.requires_user_input === true) {
        const toolInputValues = userInputValues[tool.tool_call_id] || {}

        const updatedUserInputSchema = tool.user_input_schema?.map((field) => ({
          ...field,
          value: toolInputValues[field.name] || field.value || ''
        }))

        return {
          ...tool,
          user_input_schema: updatedUserInputSchema,
          answered: true
        }
      }

      if (tool.requires_confirmation === true) {
        const choice = toolChoices[tool.tool_call_id]
        if (choice) {
          if (choice.action === 'confirm') {
            return { ...tool, confirmed: true }
          } else if (choice.action === 'reject') {
            return {
              ...tool,
              confirmed: false,
              tool_call_error: true,
              confirmation_note:
                toolRejectionReasons[tool.tool_call_id] || 'Rejected by user'
            }
          }
        }
      }

      return tool
    })

    if (onUserInputSubmit) {
      await onUserInputSubmit('', updatedTools)
    }
    setIsSubmitting(false)
  }

  // input dialog form
  const renderUserInputForm = (tool: ToolCall, answered: boolean) => {
    if (!tool.user_input_schema || tool.user_input_schema.length === 0) {
      return null
    }

    return (
      <div>
        {disableHitlForm || answered ? (
          <div
            key={`input-${tool.tool_call_id}`}
            className="flex h-12 w-[320px] items-center justify-between rounded-md border-[1px] border-border bg-accent p-3"
          >
            <div className="flex items-center gap-2">
              <Icon type="tool" className="size-5 bg-accent" />
              <Paragraph size="label" className="uppercase text-muted">
                {tool?.tool_name && tool.tool_name.length > 20
                  ? `${tool.tool_name.slice(0, 20)}...`
                  : tool.tool_name || ''}
              </Paragraph>
            </div>
            <Paragraph size="label" className="uppercase text-muted">
              Answered
            </Paragraph>
          </div>
        ) : (
          <div
            key={`input-${tool.tool_call_id}`}
            className="flex w-[320px] flex-col justify-between space-y-4 rounded-md border-[1px] border-border bg-accent p-3"
          >
            <div className="flex items-center gap-2">
              <Icon type="tool" className="size-5 bg-accent" />
              <Paragraph size="label" className="uppercase text-muted">
                {tool.tool_name}
              </Paragraph>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                {tool.user_input_schema.map((field) => {
                  const value =
                    userInputValues[tool.tool_call_id]?.[field.name] ??
                    field.value ??
                    ''
                  const shouldDisableInput = answered || disableHitlForm

                  return (
                    <ToolInputField
                      key={`${tool.tool_call_id}-${field.name}`}
                      field={field as UserInputField}
                      toolCallId={tool.tool_call_id}
                      value={value}
                      onChange={(newValue) =>
                        handleInputChange(
                          tool.tool_call_id,
                          field.name,
                          newValue
                        )
                      }
                      disabled={shouldDisableInput}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  //  confirmation dialog  form
  const renderConfirmationDialog = (tool: ToolCall, answered: boolean) => {
    const shouldDisableButtons = isLoading || answered || disableHitlForm
    const accordianOpen = answered || disableHitlForm
    const currentChoice = toolChoices[tool.tool_call_id]?.action
    return (
      <div>
        {disableHitlForm || answered ? (
          <div
            key={`input-${tool.tool_call_id}`}
            className="flex h-12 w-[320px] items-center justify-between rounded-md border-[1px] border-border bg-accent p-3"
          >
            <div className="flex items-center gap-2">
              <Icon type="tool" className="size-6 bg-accent" />
              <Paragraph size="label" className="uppercase text-muted">
                {tool.tool_name && tool.tool_name.length > 20
                  ? `${tool.tool_name.slice(0, 20)}...`
                  : tool.tool_name || ''}
              </Paragraph>
            </div>
            <Paragraph size="label" className="uppercase text-muted">
              {tool.confirmed === true
                ? 'Confirmed'
                : tool.confirmed === false
                  ? 'Rejected'
                  : toolChoices[tool.tool_call_id].action === 'confirm'
                    ? 'Confirmed'
                    : 'Rejected'}
            </Paragraph>
          </div>
        ) : (
          <div
            key={tool.tool_call_id}
            className="min-h-22 flex w-[320px] flex-col justify-between space-y-4 rounded-md border-[1px] border-border bg-accent p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon type="tool" className="size-5 bg-accent" />
                <Paragraph size="label" className="uppercase text-muted">
                  {tool.tool_name}
                </Paragraph>
              </div>
              <div className="flex gap-2">
                {[
                  { action: 'reject', icon: 'cross' },
                  { action: 'confirm', icon: 'check' }
                ].map(({ action, icon }) => (
                  <Button
                    key={action}
                    variant="secondary"
                    onClick={() =>
                      handleToolChoice(
                        tool.tool_call_id,
                        action as 'confirm' | 'reject'
                      )
                    }
                    disabled={shouldDisableButtons}
                    className={`h-6 w-6 rounded-sm p-2 ${
                      currentChoice === action
                        ? 'shadow-[0px_0px_0px_1px_rgba(var(--color-primary),0.5),0px_1px_2px_0px_rgba(var(--color-primary),0.1)]'
                        : ''
                    }`}
                  >
                    <Icon type={icon as IconType} className="size-4" />
                  </Button>
                ))}
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue={accordianOpen ? undefined : 'item-1'}
            >
              <AccordionItem
                value="item-1"
                className="rounded-sm border-[1px] border-border bg-secondary/50 px-2"
              >
                <AccordionTrigger iconPosition="right" icon="chevron-down">
                  <Paragraph size="label" className="text-muted">
                    ARGUMENTS
                  </Paragraph>
                </AccordionTrigger>
                <AccordionContent>
                  {Object.entries(tool.tool_args ?? {}).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Paragraph size="body" className="text-muted">
                        {key}:
                      </Paragraph>
                      <Paragraph size="body" className="text-primary">
                        {value}
                      </Paragraph>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {currentChoice === 'reject' && (
              <div
                className="w-full space-y-2"
                key={`rejection-${tool.tool_call_id}`}
              >
                <Label
                  htmlFor="rejection-reason"
                  className={cn('uppercase text-muted', PARAGRAPH_SIZES.label)}
                >
                  Rejection reason (optional)
                </Label>
                <Textarea
                  id={`rejection-reason-${tool.tool_call_id}`}
                  value={toolRejectionReasons[tool.tool_call_id] || ''}
                  onChange={(e) =>
                    setToolRejectionReasons({
                      ...toolRejectionReasons,
                      [tool.tool_call_id]: e.target.value
                    })
                  }
                  placeholder="Enter reason for rejection..."
                  className="w-full"
                  rows={3}
                  disabled={shouldDisableButtons}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderToolsList = (toolsToRender: ToolCall[], isAnswered: boolean) => {
    return toolsToRender.map((tool) => {
      const isUserInput = isAnswered
        ? tool.answered !== null
        : tool.requires_user_input === true
      const isConfirmation = isAnswered
        ? tool.confirmed !== null
        : tool.requires_confirmation === true

      if (isUserInput) {
        return renderUserInputForm(tool, isAnswered)
      }
      if (isConfirmation) {
        return renderConfirmationDialog(tool, isAnswered)
      }
      return null
    })
  }

  const { answeredTools, pendingTools } = tools.reduce<{
    answeredTools: ToolCall[]
    pendingTools: ToolCall[]
  }>(
    (acc, tool) => {
      if (tool.answered !== null || tool.confirmed !== null) {
        acc.answeredTools.push(tool)
      } else {
        acc.pendingTools.push(tool)
      }
      return acc
    },
    { answeredTools: [], pendingTools: [] }
  )

  const { userInputTools, confirmationTools } = pendingTools.reduce<{
    userInputTools: ToolCall[]
    confirmationTools: ToolCall[]
  }>(
    (acc, tool) => {
      if (tool.requires_user_input && tool.answered === null) {
        acc.userInputTools.push(tool)
      }
      if (tool.requires_confirmation && tool.confirmed === null) {
        acc.confirmationTools.push(tool)
      }
      return acc
    },
    { userInputTools: [], confirmationTools: [] }
  )

  const hasUnhandledTools =
    confirmationTools.some((tool) => !toolChoices[tool.tool_call_id]) ||
    userInputTools.some((tool) => {
      const values = userInputValues[tool?.tool_call_id]
      return tool.user_input_schema?.some((field) => {
        if (field.field_type === 'bool' || field.field_type === 'boolean') {
          return false
        }

        const toolValues = values || {}
        return (
          (field.value === null || typeof field.value === 'undefined') &&
          (!toolValues[field.name] || !toolValues[field.name].trim())
        )
      })
    })

  const shouldDisableSendChoices =
    isLoading || disableHitlForm || hasUnhandledTools

  return (
    <div className="space-y-4">
      {dynamicContent && (
        <Paragraph size="body" className="text-primary/80">
          {dynamicContent}
        </Paragraph>
      )}
      {answeredTools?.length > 0 && (
        <React.Fragment>{renderToolsList(answeredTools, true)}</React.Fragment>
      )}

      {pendingTools?.length > 0 &&
        (userInputTools?.length > 0 || confirmationTools?.length > 0) && (
          <React.Fragment>
            {renderToolsList(pendingTools, false)}
            {!disableHitlForm && (
              <Button
                onClick={handleSendChoices}
                variant="secondary"
                disabled={shouldDisableSendChoices}
                className="w-full max-w-[320px]"
              >
                {isSubmitting ? (
                  <LoadingSpinner
                    className={cn(
                      'm-0 size-5 stroke-primary transition-opacity duration-200'
                    )}
                  />
                ) : (
                  'SUBMIT'
                )}
              </Button>
            )}
          </React.Fragment>
        )}
    </div>
  )
}

export default DynamicHITLComponent

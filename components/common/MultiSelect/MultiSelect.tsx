import * as React from 'react'

import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import Icon, { IconType } from '@/components/ui/icon'
import { SquareCheckbox } from '@/components/ui/square-checkbox'
import { MultiSelectProps } from './types'
import { useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      popoverContentAlign = 'start',
      defaultValue = [],
      selectAllEnabled = false,
      placeholder = 'Select options',
      allSelectLabel = 'All',
      noneSelectedLabel = 'None selected',
      popoverContentClassName,
      className,
      maxCount = 4,
      checkboxType = 'square',
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    const toggleOption = (option: string) => {
      const isAlreadySelected = selectedValues.includes(option)

      if (maxCount === 1) {
        const newSelectedValues = isAlreadySelected ? [] : [option]

        if (newSelectedValues.length === 0 && selectedValues.length === 1) {
          return
        }

        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      } else {
        const newSelectedValues = isAlreadySelected
          ? selectedValues.filter((value) => value !== option)
          : [...selectedValues, option]

        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    // Group-level selection logic
    const toggleGroup = (groupItems: string[], allSelected: boolean) => {
      let newSelectedValues: string[]
      if (allSelected) {
        // Deselect all in group
        newSelectedValues = selectedValues?.filter(
          (val) => !groupItems?.includes(val)
        )
      } else {
        // Select all in group (add missing)
        const toAdd = groupItems?.filter(
          (val) => !selectedValues?.includes(val)
        )
        newSelectedValues = [...selectedValues, ...toAdd]
      }
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev)
    }
    useEffect(() => {
      setSelectedValues(defaultValue)
    }, [defaultValue])

    // Compute all selectable values
    const allOptionValues = React.useMemo(
      () =>
        options?.flatMap((group) => group.items?.map((item) => item.value)) ||
        [],
      [options]
    )
    const isAllSelected =
      allOptionValues.length > 0 &&
      allOptionValues?.every((val) => selectedValues?.includes(val))
    const isIndeterminate = selectedValues.length > 0 && !isAllSelected
    const handleSelectAll = () => {
      if (isAllSelected) {
        setSelectedValues([])
        onValueChange([])
      } else {
        setSelectedValues(allOptionValues)
        onValueChange(allOptionValues)
      }
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            variant="outline"
            className={cn(
              'truncate px-3 py-2 font-inter normal-case',
              className
            )}
          >
            <div className="flex w-[-webkit-fill-available] items-center justify-between gap-3 truncate">
              {selectedValues.length > 0 ? (
                <div className="flex items-center gap-1 truncate">
                  <span className="text-sm tracking-[-0.28px] text-muted">
                    {placeholder}
                  </span>
                  {(() => {
                    // Check if all values are selected
                    if (isAllSelected) {
                      return (
                        <span className="text-sm tracking-[-0.28px]" key="all">
                          {allSelectLabel}
                        </span>
                      )
                    }

                    // For single selection, show the selected item label
                    if (maxCount === 1) {
                      const selectedValue = selectedValues?.[0]
                      const selectedOption = options
                        ?.flatMap((group) => group.items)
                        ?.find((option) => option.value === selectedValue)
                      return selectedOption ? (
                        <span
                          className="text-sm tracking-[-0.28px]"
                          key={selectedValue}
                        >
                          {selectedOption?.triggerLabel ||
                            selectedOption?.label}
                        </span>
                      ) : null
                    }

                    // For multiple selection, show selected labels up to maxCount
                    const selectedOptions = selectedValues
                      ?.slice(0, maxCount)
                      ?.map((value) => {
                        const option = options
                          ?.flatMap((group) => group.items)
                          ?.find((opt) => opt?.value === value)
                        return option ? option?.label : null
                      })
                      ?.filter(Boolean)

                    return (
                      <span className="truncate text-sm tracking-[-0.28px]">
                        {selectedOptions?.join(', ')}
                      </span>
                    )
                  })()}
                </div>
              ) : (
                <div className="flex w-[-webkit-fill-available] items-center justify-between gap-3 truncate">
                  <span className="text-muted-foreground text-sm tracking-[-0.28px]">
                    <span className="text-muted">{placeholder}</span>{' '}
                    {noneSelectedLabel}
                  </span>
                </div>
              )}

              <Icon type="triangle-down" size="xs" className="shrink-0" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'z-50 w-[var(--radix-popover-trigger-width)] bg-background p-0',
            popoverContentClassName
          )}
          align={popoverContentAlign}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandList>
              {selectAllEnabled && (
                <React.Fragment>
                  <CommandItem
                    onSelect={handleSelectAll}
                    className="cursor-pointer"
                  >
                    <div className="ml-[3.5px] flex items-center gap-2">
                      <SquareCheckbox
                        checked={
                          isAllSelected
                            ? true
                            : isIndeterminate
                              ? 'indeterminate'
                              : false
                        }
                      />
                      <span className="font-primary text-sm">
                        {isAllSelected ? '(De)select all' : 'Select all'}
                      </span>
                    </div>
                  </CommandItem>
                  <CommandSeparator />
                </React.Fragment>
              )}
              {options?.map((item, index) => (
                <React.Fragment key={item.label}>
                  <CommandGroup
                    key={item.label}
                    heading={
                      item.isGroup ? (
                        <div className="flex items-center gap-2">
                          {item.isGroupSelectable ? (
                            <SquareCheckbox
                              checked={
                                item.items?.every((opt) =>
                                  selectedValues?.includes(opt.value)
                                )
                                  ? true
                                  : item.items?.some((opt) =>
                                        selectedValues?.includes(opt.value)
                                      )
                                    ? 'indeterminate'
                                    : false
                              }
                              onCheckedChange={() => {
                                const allSelected = item.items?.every((opt) =>
                                  selectedValues?.includes(opt.value)
                                )
                                toggleGroup(
                                  item.items?.map((opt) => opt.value) || [],
                                  allSelected
                                )
                              }}
                            />
                          ) : null}
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                      ) : (
                        item.label
                      )
                    }
                  >
                    {item.items?.map((option) => {
                      const isSelected = selectedValues?.includes(option.value)
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            toggleOption(option?.value)
                            if (maxCount === 1) handleTogglePopover()
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex w-full justify-between">
                            <div className="flex items-center gap-2">
                              {checkboxType === 'circle' ? (
                                <RadioGroup
                                  onValueChange={() =>
                                    toggleOption(option.value)
                                  }
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    checked={isSelected}
                                  />
                                </RadioGroup>
                              ) : (
                                <SquareCheckbox checked={isSelected} />
                              )}

                              {option?.icon && (
                                <Icon
                                  type={option.icon as IconType}
                                  size="xs"
                                />
                              )}
                              <span>{option?.label}</span>
                            </div>
                            {option?.rightSubLabel && (
                              <span className="text-sm text-muted">
                                {option.rightSubLabel}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  {item.isGroup && index !== options.length - 1 && (
                    <CommandSeparator />
                  )}
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'

export default MultiSelect

import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'

import Paragraph from '@/components/ui/typography/Paragraph'

interface DatabaseBreadcrumbProps {
  selectedValue: string
  selectedLabel: string
  options: Array<{ value: string; label: string }>
  onSelect: (value: string) => void
}

export default function DatabaseBreadcrumb({
  selectedValue,
  selectedLabel,
  options,
  onSelect
}: DatabaseBreadcrumbProps) {
  return (
    <div className="flex w-full flex-col gap-0">
      <Paragraph size="xsmall" className="ml-1 text-muted">
        Database
      </Paragraph>

      <BreadcrumbCombobox
        selectedItem={{
          value: selectedValue,
          label: selectedLabel
        }}
        triggerTooltipSide="right"
        {...(options.length > 1 && {
          itemList: options,
          onItemSelect: onSelect
        })}
        isDropdownListPresent={options.length > 1}
      />
    </div>
  )
}

import BreadcrumbCombobox from '@/components/ui/BreadcrumbCombobox'

import Paragraph from '@/components/ui/typography/Paragraph'

interface TableBreadcrumbProps {
  selectedValue: string
  selectedLabel: string
  options: Array<{ value: string; label: string }>
  onSelect: (value: string) => void
}

export default function TableBreadcrumb({
  selectedValue,
  selectedLabel,
  options,
  onSelect
}: TableBreadcrumbProps) {
  return (
    <div className="flex w-full flex-col gap-0">
      <Paragraph size="xsmall" className="ml-1 text-muted">
        Table
      </Paragraph>

      <BreadcrumbCombobox
        selectedItem={{
          value: selectedValue,
          label: selectedLabel
        }}
        {...(options.length > 1 && {
          itemList: options,
          onItemSelect: onSelect
        })}
        isDropdownListPresent={options.length > 1}
      />
    </div>
  )
}

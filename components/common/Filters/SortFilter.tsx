import MultiSelect from '@/components/common/MultiSelect/MultiSelect'
import Icon from '@/components/ui/icon'
import { SortBy, SortFilterType } from '@/types/filter'
import { useLocation, useNavigate } from 'react-router-dom'

const sortOptionsLastUpdated = [
  {
    label: 'Date',
    isGroup: true,
    items: [
      {
        label: 'Ascending',
        value: SortBy.LAST_UPDATED_ASC,
        triggerLabel: 'Date ascending',
        rightSubLabel: (
          <Icon
            type="arrow-up-right-narrow-wide"
            size="xs"
            color="primary/50"
          />
        )
      },
      {
        label: 'Descending',
        value: SortBy.LAST_UPDATED_DESC,
        triggerLabel: 'Date descending',
        rightSubLabel: (
          <Icon type="arrow-down-wide-narrow" size="xs" color="primary/50" />
        )
      }
    ]
  }
  // {
  //   label: 'Name',
  //   isGroup: true,
  //   items: [
  //     {
  //       label: 'Ascending',
  //       value: 'name_asc',
  //       triggerLabel: 'Name ascending',
  //       rightSubLabel: (
  //         <Icon type="arrow-down-a-z" size="xs" color="primary/50" />
  //       )
  //     },
  //     {
  //       label: 'Descending',
  //       value: 'name_desc',
  //       triggerLabel: 'Name descending',
  //       rightSubLabel: (
  //         <Icon type="arrow-down-z-a" size="xs" color="primary/50" />
  //       )
  //     }
  //   ]
  // }
]

const sortOptionsUpdatedAt = [
  {
    label: 'Date',
    isGroup: true,
    items: [
      {
        label: 'Ascending',
        value: SortBy.UPDATED_AT_ASC,
        triggerLabel: 'Date ascending',
        rightSubLabel: (
          <Icon
            type="arrow-up-right-narrow-wide"
            size="xs"
            color="primary/50"
          />
        )
      },
      {
        label: 'Descending',
        value: SortBy.UPDATED_AT_DESC,
        triggerLabel: 'Date descending',
        rightSubLabel: (
          <Icon type="arrow-down-wide-narrow" size="xs" color="primary/50" />
        )
      }
    ]
  }
]

interface SortFilterProps {
  type?: SortFilterType
}

const SortFilter = ({
  type = SortFilterType.LAST_UPDATED
}: SortFilterProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const defaultValue =
    type === SortFilterType.LAST_UPDATED
      ? SortBy.LAST_UPDATED_DESC
      : SortBy.UPDATED_AT_DESC

  const sortBy =
    new URLSearchParams(location.search).get('sort_by') || defaultValue

  const handleValueChange = (value: string[]) => {
    const newSortBy = value[0] || defaultValue

    // Only navigate if the value actually changed
    if (newSortBy === sortBy) return

    const params = new URLSearchParams(location.search)
    params.set('sort_by', newSortBy)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  return (
    <MultiSelect
      options={
        type === SortFilterType.LAST_UPDATED
          ? sortOptionsLastUpdated
          : sortOptionsUpdatedAt
      }
      onValueChange={handleValueChange}
      placeholder="Sort by:"
      maxCount={1}
      popoverContentAlign="end"
      value={[sortBy]}
      defaultValue={[sortBy]}
      checkboxType="circle"
      className="w-[14.375rem]"
      popoverContentClassName="w-[14.375rem]"
    />
  )
}

export default SortFilter

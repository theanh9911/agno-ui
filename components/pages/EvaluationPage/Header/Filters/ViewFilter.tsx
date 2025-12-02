import MultiSelect from '@/components/common/MultiSelect/MultiSelect'
import { OptionGroup } from '@/components/common/MultiSelect/types'
import { EvalRunType } from '@/types/evals'
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
// import { getProviderIcon } from '@/utils/modelProvider'

const TYPES_GROUP: OptionGroup = {
  label: 'Types',
  isGroup: true,
  isGroupSelectable: true,
  items: [
    { label: 'Accuracy', value: EvalRunType.Accuracy },
    { label: 'Performance', value: EvalRunType.Performance },
    { label: 'Reliability', value: EvalRunType.Reliability }
  ]
}

interface ViewFilterProps {
  availableModels?: Array<{ model_id: string; model_provider?: string }>
}

/**
 * ViewFilter component for filtering evaluations by types and models
 * @param availableModels - Array of available models with their providers from the data
 */
const ViewFilter = ({ availableModels = [] }: ViewFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedFilters = searchParams.get('view_filters') || ''

  const selectedValues = useMemo(() => {
    return selectedFilters ? selectedFilters.split(',') : []
  }, [selectedFilters])

  const handleValueChange = (values: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (values.length > 0) {
      newSearchParams.set('view_filters', values.join(','))
    } else {
      newSearchParams.delete('view_filters')
    }

    // Update search params directly (React Router handles URL construction)
    setSearchParams(newSearchParams, { replace: true })
  }

  const filterOptions: OptionGroup[] = useMemo(() => {
    // const uniqueModels = Array.from(
    //   new Map(
    //     availableModels
    //       .filter((model) => model.model_id)
    //       .map((model) => [model.model_id, model])
    //   ).values()
    // )

    const options = [TYPES_GROUP]
    // if (uniqueModels.length > 0) {
    //   const modelsGroup: OptionGroup = {
    //     label: 'Models',
    //     isGroup: true,
    //     isGroupSelectable: true,
    //     items: uniqueModels.map((model) => {
    //       const providerIcon = model.model_provider
    //         ? getProviderIcon(model.model_provider)
    //         : null

    //       return {
    //         label: model.model_id,
    //         value: `model_${model.model_id}`,
    //         ...(providerIcon && { icon: providerIcon })
    //       }
    //     })
    //   }
    //   options.push(modelsGroup)
    // }
    return options
  }, [availableModels])

  return (
    <MultiSelect
      options={filterOptions}
      onValueChange={handleValueChange}
      placeholder="View:"
      noneSelectedLabel="All evaluations"
      allSelectLabel="All evaluations"
      selectAllEnabled={true}
      maxCount={filterOptions.reduce(
        (acc, group) => acc + group.items.length,
        0
      )}
      defaultValue={selectedValues}
      className="w-[200px]"
    />
  )
}

export default ViewFilter

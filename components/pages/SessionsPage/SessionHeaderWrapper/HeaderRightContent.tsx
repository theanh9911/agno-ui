import { type FC } from 'react'
import HeaderTabs from './HeaderTabs'
import { SortFilterType } from '@/types/filter'
import SortFilter from '@/components/common/Filters/SortFilter'

const HeaderRightContent: FC = () => {
  return (
    <div className="flex justify-end gap-4">
      <SortFilter type={SortFilterType.UPDATED_AT} />
      <HeaderTabs />
    </div>
  )
}
export default HeaderRightContent

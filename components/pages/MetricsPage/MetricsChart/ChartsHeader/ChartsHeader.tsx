import { type FC } from 'react'
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import ExportDropdown from '../../MetricsControls/ExportDropdown'

interface ChartsHeaderProps {
  title: string
  total: string
  onExport: (type: 'csv' | 'json') => void
}

const ChartsHeader: FC<ChartsHeaderProps> = ({ title, total, onExport }) => {
  return (
    <div className="z-10 flex items-center justify-between">
      <Paragraph size="lead" className="text-primary/80">
        {title}
      </Paragraph>

      <div className="flex items-center gap-x-2">
        <Heading size={3} className="text-primary/100">
          {total}
        </Heading>

        <ExportDropdown onExport={onExport} triggerType="icon" />
      </div>
    </div>
  )
}

export default ChartsHeader

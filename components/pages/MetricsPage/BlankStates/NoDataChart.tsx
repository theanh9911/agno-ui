import { Minus } from 'lucide-react'
import Paragraph from '@/components/ui/typography/Paragraph'

import { useTheme } from 'next-themes'
import Image from '@/components/ui/Image'

interface NoDataChartProps {
  title: string
}
import { ChartEnum, labelMap } from '../constant'

const NoDataChart = ({ title }: NoDataChartProps) => {
  const { resolvedTheme } = useTheme()
  const imageSrc =
    resolvedTheme === 'dark'
      ? '/images/chartbg_darkmode.svg'
      : '/images/chartbg_lightmode.svg'

  return (
    <div>
      <div className="flex justify-between">
        <Paragraph size="lead" className="text-primary/50">
          {labelMap[title as ChartEnum]}
        </Paragraph>
        <Minus className="size-[26px] text-muted" />
      </div>
      <div className="relative mt-5 h-[238px] w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt="chart-bg"
            className="h-full w-full object-cover"
            width={0}
            height={0}
          />
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="z-10 flex h-[36px] w-[188px] items-center justify-center rounded-md bg-secondary shadow-sm">
            <Paragraph size="mono" className="text-primary/50">
              NO DATA AVAILABLE YET
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NoDataChart

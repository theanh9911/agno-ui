import { FC } from 'react'
import { HeaderWrapper } from '@/components/layouts/Header'

type HeaderContentProps = {
  leftContent?: React.ReactNode[]
  rightContent?: React.ReactNode[]
}

type HomePageHeaderWrapperProps = {
  isLoading?: boolean
  topContent?: HeaderContentProps
  bottomContent?: HeaderContentProps
}

const HomePageHeaderWrapper: FC<HomePageHeaderWrapperProps> = ({
  topContent,
  bottomContent,
  isLoading
}) => {
  return (
    <HeaderWrapper
      topContent={topContent}
      bottomContent={{
        leftContent: bottomContent?.leftContent?.length ? (
          <div className="flex items-center gap-3">
            {bottomContent.leftContent.map((item) => item)}
          </div>
        ) : (
          <></>
        ),
        rightContent: bottomContent?.rightContent?.length ? (
          <div className="flex items-center gap-2">
            {bottomContent.rightContent.map((item) => item)}
          </div>
        ) : null
      }}
      isLoading={isLoading}
    />
  )
}

export default HomePageHeaderWrapper

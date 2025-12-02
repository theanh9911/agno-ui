import React from 'react'
import { ContentWrapper } from '@/components/layouts/PageWrapper'
import HomePageHeaderWrapper from './HomePageHeaderWrapper'
import { HeadingText } from '@/components/layouts/Header'

interface HomePageLayoutProps {
  children: React.ReactNode
  userName?: string | null
}

const HomePageLayout = ({ children, userName }: HomePageLayoutProps) => {
  return (
    <>
      <HomePageHeaderWrapper
        bottomContent={{
          leftContent: [
            <HeadingText
              key="home-heading-text"
              noTruncate
              text={`Welcome ${userName?.split(' ')[0]}`}
            />
          ]
        }}
      />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  )
}

export default HomePageLayout

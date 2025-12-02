import React from 'react'

import ExplorePage from '../ConnectedOS/ExplorePage'
import ComponentList from '../ConnectedOS/ComponentList'
import { componentSections } from '@/utils/MockData'
import TeaserPageWrapper from '@/components/common/TeaserPageWrapper'

const ConnectedOSTeaserPage = () => {
  return (
    <TeaserPageWrapper className="pointer-events-none flex h-full w-full flex-col">
      <div className="flex w-full flex-col gap-y-4 overflow-hidden pb-4">
        <ExplorePage />

        {componentSections.map(({ key, title, data }) =>
          data && data.length > 0 ? (
            <ComponentList key={key} list={data} title={title} />
          ) : null
        )}
      </div>
    </TeaserPageWrapper>
  )
}

export default ConnectedOSTeaserPage

import Paragraph from '@/components/ui/typography/Paragraph'
import { HOMEPAGE_CARDS } from '../constant'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const ExplorePage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Paragraph size="label" className="uppercase text-primary">
        Explore
      </Paragraph>
      <div className="grid-responsive-basic gap-4">
        {HOMEPAGE_CARDS.map((card) => (
          <Link
            to={card.link}
            key={card.label}
            className="outline-none focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
          >
            <div className="relative flex h-full flex-col gap-y-2 rounded-sm border border-border p-4">
              <div className="flex items-center gap-2">
                <Icon type={card.icon} size="xxs" className="text-muted" />
                <Paragraph size="title" className="text-muted">
                  {card.label}
                </Paragraph>
              </div>
              <div className="flex justify-between">
                <Paragraph size="body" className="w-[90%] text-primary">
                  {card.description}
                </Paragraph>
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="secondary"
                    icon="arrow-up-right"
                    size="iconSmall"
                    className="flex-shrink-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ExplorePage

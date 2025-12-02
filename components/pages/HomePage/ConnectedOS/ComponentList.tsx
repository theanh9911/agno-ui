import Icon, { IconType } from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Interface, OSAgent, OSTeam, OSWorkflow } from '@/types/os'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useState } from 'react'

import IconContainer from '@/components/common/Chat/IconContainer'
import { Button } from '@/components/ui/button'
import { getComponentChatRoute } from '../utils'
import { useRouter } from '@/utils/navigation'
import { iconType } from '../constant'
import { InterfaceEnum } from '@/constants'
import { ROUTES } from '@/routes'

type ComponentsListProps = {
  list: Array<OSAgent | OSTeam | OSWorkflow | Interface>
  title: string
}
const INTERFACE_ICONS: Record<InterfaceEnum, string> = {
  [InterfaceEnum.WHATSAPP]: 'whatsapp',
  [InterfaceEnum.SLACK]: 'slack',
  [InterfaceEnum.CHAT]: 'chat-bubble'
}
const ComponentList = ({ list, title }: ComponentsListProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const type = title.toLowerCase().slice(0, -1)
  const handleAction = (
    component: OSAgent | OSTeam | OSWorkflow,
    action: 'chat' | 'config'
  ) => {
    const href =
      action === 'chat'
        ? getComponentChatRoute(component.id, type || '')
        : `${ROUTES.UserEntityConfig}?type=${type}&id=${component.id}`
    router.push(href)
  }
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`os-config-item-${title}`}
      onValueChange={() => setIsOpen(!isOpen)}
    >
      <AccordionItem value={`os-config-item-${title}`}>
        <AccordionTrigger
          iconPosition="right"
          className="flex w-full gap-2"
          showIcon={false}
        >
          <div className="flex w-full items-center gap-2">
            <Icon
              type="caret-down"
              size="xs"
              className={`text-primary transition-transform duration-200 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
            <Paragraph size="label" className="uppercase text-primary">
              {title}
            </Paragraph>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0 pt-4">
          <div className="grid-responsive-basic gap-4">
            {list?.map((item, index) => {
              const isInterfaceItem = title === 'Interfaces'
              const itemName = isInterfaceItem
                ? (item as Interface).type
                : ((item as OSAgent | OSTeam | OSWorkflow)?.name ??
                  `${type}${index}`)

              return (
                <div
                  key={`${title}-${index}`}
                  className="flex items-center justify-between gap-1 rounded-md border border-border bg-secondary/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <IconContainer
                      icon={
                        isInterfaceItem
                          ? ((INTERFACE_ICONS[
                              (item as Interface).type as InterfaceEnum
                            ] || 'chat-bubble') as IconType)
                          : (iconType[
                              type as keyof typeof iconType
                            ] as IconType)
                      }
                      color={isInterfaceItem ? 'bg-secondary ' : undefined}
                      className="border border-border"
                    />
                    <Paragraph
                      size="label"
                      className="line-clamp-2 uppercase text-primary"
                    >
                      {itemName}
                    </Paragraph>
                  </div>

                  {isInterfaceItem ? (
                    <Paragraph size="body" className="truncate text-primary">
                      {(item as Interface).route}
                    </Paragraph>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleAction(
                            item as OSAgent | OSTeam | OSWorkflow,
                            'chat'
                          )
                        }
                      >
                        Chat
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleAction(
                            item as OSAgent | OSTeam | OSWorkflow,
                            'config'
                          )
                        }
                      >
                        Config
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ComponentList

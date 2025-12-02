import { FC } from 'react'
import type { SectionWrapperProps } from '../../types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Paragraph from '@/components/ui/typography/Paragraph'
import Icon from '@/components/ui/icon'
import { getProviderIcon } from '@/utils/modelProvider'

export const SectionWrapper: FC<SectionWrapperProps> = ({
  title,
  content,
  headerContent,
  showAccordion,
  icon,
  metadata
}) => {
  const headerNode = headerContent || (
    <div className="flex items-center gap-2">
      {icon && <Icon type={icon} size="xxs" className="text-primary" />}
      <Paragraph size="label" className="uppercase text-primary">
        {title}
      </Paragraph>
      {metadata && (
        <div className="flex items-center gap-2">
          {metadata.count !== undefined && (
            <span className="flex min-w-[32px] items-center justify-center rounded-md bg-secondary/50 px-2 py-0.5 text-[10px] text-muted">
              {metadata.count}
            </span>
          )}
          {metadata.modelProvider && (
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-0.5">
              <Icon
                type={getProviderIcon(metadata.modelProvider)}
                size="xxs"
                className="text-muted"
              />
              {metadata.modelName && (
                <span className="text-[10px] text-muted">
                  {metadata.modelName}
                </span>
              )}
            </div>
          )}
          {metadata.label && (
            <span className="flex items-center text-xs text-muted">
              {metadata.label}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (!showAccordion) {
    return (
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex justify-start gap-2">{headerNode}</div>
        <div className="pl-0">{content}</div>
      </div>
    )
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="open">
        <AccordionTrigger
          icon="caret-down"
          iconPosition="right"
          iconColor="text-primary"
          iconSize="size-3"
          className="justify-between gap-2"
        >
          {headerNode}
        </AccordionTrigger>
        <AccordionContent className="pb-0">{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

import React, { type FC } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import ReasoningStep from './ReasoningStep'
import Paragraph from '@/components/ui/typography/Paragraph'
import { ReasoningStepContent } from '@/types/playground'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '@/components/ui/icon'
import { cn } from '@/utils/cn'

interface ReasoningProps {
  reasoning?: ReasoningStepContent[]
  time?: string
  isLoading?: boolean
  label?: string
  open?: boolean
  defaultOpen?: boolean
  heightLimit?: number | undefined
}

const AccordianReasoning: FC<ReasoningProps> = ({
  reasoning,
  time,
  isLoading,
  label,
  open,
  defaultOpen,
  heightLimit = undefined
}) => {
  const [isOpen, setIsOpen] = React.useState(open ?? defaultOpen ?? true)
  const handleAccordionChange = (value: string) => {
    const isOpening = value !== ''
    setIsOpen(isOpening)
  }

  const heightLimitClass = heightLimit
    ? `max-h-[${heightLimit}px] overflow-y-auto`
    : ''

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isOpen ? 'reasoning' : ''}
      className="w-full"
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value="reasoning" className="border-none">
        <AccordionTrigger
          iconPosition="right"
          icon="caret-down"
          iconColor="text-muted"
          className="flex h-7 w-fit flex-none rounded-sm bg-secondary px-2 py-1 text-muted outline outline-1 outline-border"
        >
          {isLoading && (
            <Icon
              type="loader-2"
              className="animate-spin text-muted/80"
              size="xs"
            />
          )}
          <Paragraph size="mono" className="flex items-center gap-2 text-muted">
            <span className="text-muted/50">{time}</span>
            <span className="uppercase tracking-[0.02em]">
              {label || 'Reasoning'}
            </span>
          </Paragraph>
        </AccordionTrigger>
        <AccordionContent className={cn('w-full pb-0', heightLimitClass)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 flex flex-col items-start justify-center gap-2"
          >
            <AnimatePresence mode="popLayout">
              {isOpen &&
                reasoning?.map((item, index) => {
                  if (item.title || item.action) {
                    return (
                      <motion.div
                        key={`${item.title}-${item.action}-${item.reasoning}-${item.result}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: Math.min(index * 0.05, 0.5),
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        className="w-full"
                      >
                        <ReasoningStep
                          stepTitle={item.title || ''}
                          stepContent={item?.result || item?.reasoning}
                          index={index}
                        />
                      </motion.div>
                    )
                  }
                  return null
                })}
            </AnimatePresence>
          </motion.div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordianReasoning

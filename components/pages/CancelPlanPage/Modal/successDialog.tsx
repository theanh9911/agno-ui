import { Button } from '@/components/ui/button'
import { DialogContent } from '@/components/ui/dialog'
import Paragraph from '@/components/ui/typography/Paragraph'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTheme } from 'next-themes'
import React from 'react'
import { CANCEL_PLAN_TEXT } from '../constants'
import { FeaturesIconWrapper } from '../components/FeaturesIconWrapper'

const SuccessDialog = ({ onClose }: { onClose: () => void }) => {
  const { resolvedTheme } = useTheme()
  const ImageSrc =
    resolvedTheme === 'dark'
      ? '/images/billing/unsubscribe_dark.svg'
      : '/images/billing/unsubscribe_light.svg'
  return (
    <DialogContent className="max-w-[800px] overflow-hidden p-0">
      {' '}
      <div className="flex flex-row gap-2 overflow-hidden p-2">
        <div className="flex flex-col gap-4 p-4">
          <DialogTitle className="text-lg font-medium leading-[1.2] tracking-[-0.18px]">
            Sorry to see you go!
          </DialogTitle>

          <div className="flex flex-col gap-2">
            <Paragraph size="body" className="text-muted">
              Your pro plan has been cancelled.
            </Paragraph>

            <FeaturesIconWrapper
              text={CANCEL_PLAN_TEXT.SUCCESS_DIALOG_MEMBERS_PLAN}
              icon="dot-filled"
              IconClassName="text-primary "
              className="items-start"
            />
            <FeaturesIconWrapper
              text={CANCEL_PLAN_TEXT.SUCCESS_DIALOG_LIVE_OS_ACCESS}
              icon="dot-filled"
              IconClassName="text-primary"
              className="items-start"
            />
          </div>
          <div className="mt-auto flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="h-8 px-4 py-2"
            >
              Got it
            </Button>
          </div>
        </div>

        <div className="flex h-[305px] w-96 items-center justify-center overflow-hidden rounded-lg bg-secondary">
          <img
            src={ImageSrc}
            alt={`Cancel Plan`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </DialogContent>
  )
}

export default SuccessDialog

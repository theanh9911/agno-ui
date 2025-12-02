import { Button } from '@/components/ui/button'
import { useBilling } from '@/providers/BillingProvider'
import { ProductType } from '@/api/generated'
import { Check } from 'lucide-react'
import { useState } from 'react'
import Paragraph from '@/components/ui/typography/Paragraph'
import { cn } from '@/utils/cn'
import { PLAN_NAMES, BILLING_MESSAGES } from '@/constants/billing'

export interface UpgradeCardBenefit {
  text: string
  featured?: boolean
}

export interface UpgradeCardProps {
  title: string
  description: string
  benefits: UpgradeCardBenefit[]
  productType: ProductType
  successPayload: Record<string, string>
  buttonText?: string
  secondaryButtonText?: string
  onSecondaryAction?: () => void
  hideActions?: boolean
  className?: string
}

export const UpgradeCard = ({
  title,
  description,
  benefits,
  productType,
  successPayload,
  buttonText = BILLING_MESSAGES.UPGRADE_TO_STARTER,
  secondaryButtonText,
  onSecondaryAction,
  hideActions = false,
  className
}: UpgradeCardProps) => {
  const billing = useBilling()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleCheckout = async () => {
    setIsUpgrading(true)
    try {
      await billing.startCheckout({
        productType,
        successPayload
      })
    } catch {
      setIsUpgrading(false)
    }
  }

  const handleOpenPortal = async () => {
    if (onSecondaryAction) {
      onSecondaryAction()
    } else {
      await billing.openPortal(window.location.href)
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-background shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),0px_4px_6px_-1px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      {/* Background fade element */}
      <div
        className="pointer-events-none absolute -bottom-[100px] -right-[100px] h-[300px] w-[300px] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(250, 250, 250, 0.1) 90%)',
          filter: 'blur(100px)'
        }}
      />

      <div className="relative p-6">
        {/* Header + description */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Paragraph size="lead" className="text-primary">
              {title}
            </Paragraph>
            <span className="inline-flex items-center rounded-sm border border-transparent bg-destructive px-2 py-[2px] font-dmmono text-xs font-normal text-white shadow">
              {PLAN_NAMES.STARTER.toUpperCase()}
            </span>
          </div>
          <p className="text-sm leading-[1.5] tracking-[-0.28px] text-muted">
            {description}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-4 flex flex-col gap-2">
          <Paragraph size="body" className="text-primary">
            Benefits
          </Paragraph>
          <div className="grid grid-cols-1 gap-x-12 gap-y-2 sm:[grid-template-columns:repeat(2,max-content)]">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 stroke-2 text-primary" />
                <Paragraph size="body" className="text-muted">
                  {benefit.text}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!hideActions && (
          <div className="flex gap-4">
            <Button onClick={handleCheckout} disabled={isUpgrading}>
              {isUpgrading ? 'UPGRADING...' : buttonText}
            </Button>
            {secondaryButtonText && (
              <Button
                variant="secondary"
                onClick={handleOpenPortal}
                disabled={isUpgrading}
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UpgradeCard

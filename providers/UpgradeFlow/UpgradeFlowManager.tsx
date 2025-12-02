import { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDialog } from '@/providers/DialogProvider'
import { BillingUpgradeSuccessContent } from '@/components/modals/Billing/BillingUpgradeSuccessDialogContent'
import { useAddOS } from '@/api/hooks'
import { useBillingStatusPolling } from '@/api/hooks/queries'
import { useOSStore } from '@/stores/OSStore'

type DecodedOSParams = {
  from?: string
  name?: string
  url?: string
  tags?: string[]
  ctx: 'invite-member' | 'os-connect' | 'billing'
}

const decodeAndValidateParams = (location: {
  search: string
}): DecodedOSParams | null => {
  const params = new URLSearchParams(location.search)
  const encoded = params.get('p')

  if (!encoded) return null

  try {
    const decoded = JSON.parse(decodeURIComponent(atob(encoded))) as {
      from?: string
      'os-name'?: string
      'os-url'?: string
      'os-tags'?: string
    }

    const from = decoded.from
    const name = decoded['os-name']
    const url = decoded['os-url']
    const tags = decoded['os-tags']
      ? decoded['os-tags'].split(',').filter(Boolean)
      : []

    const ctx =
      from === 'invite-member'
        ? 'invite-member'
        : from === 'usage-remote-os' || from === 'os-connect'
          ? 'os-connect'
          : 'billing'

    return { from, name, url, tags, ctx }
  } catch {
    return null
  }
}

const canAutoCreateOS = (params: DecodedOSParams | null): boolean => {
  return !!(params?.ctx === 'os-connect' && params?.name && params?.url)
}

const UpgradeFlowManager = () => {
  const { openDialog, closeDialog, setContent } = useDialog()
  const location = useLocation()
  const navigate = useNavigate()
  const addOS = useAddOS()
  const setCurrentOS = useOSStore((state) => state.setCurrentOS)

  const [creationAttempted, setCreationAttempted] = useState(false)
  const [urlCleaned, setUrlCleaned] = useState(false)
  const [shouldKeepPolling, setShouldKeepPolling] = useState(false)
  const [inviteMemberDialogShown, setInviteMemberDialogShown] = useState(false)
  const [billingDialogShown, setBillingDialogShown] = useState(false)

  const cleanUrlParams = () => {
    if (!urlCleaned) {
      setUrlCleaned(true)
      const params = new URLSearchParams(location.search)
      params.delete('p')
      const newQuery = params.toString()
      navigate(
        {
          pathname: location.pathname,
          search: newQuery ? `?${newQuery}` : ''
        },
        { replace: true }
      )
    }
  }

  const hasUpgradeParams = useMemo(() => {
    const osParams = decodeAndValidateParams(location)
    const hasParams = !!osParams

    if (hasParams && !shouldKeepPolling) {
      setShouldKeepPolling(true)
    }

    return hasParams
  }, [location.search, shouldKeepPolling])

  const shouldPoll = hasUpgradeParams || shouldKeepPolling
  const { data: billingStatus } = useBillingStatusPolling({
    enabled: shouldPoll
  })

  useEffect(() => {
    const osParams = decodeAndValidateParams(location)
    if (!osParams) {
      return
    }

    const shouldAutoCreate = canAutoCreateOS(osParams)

    if (
      shouldAutoCreate &&
      billingStatus?.has_subscription &&
      !creationAttempted
    ) {
      // AgentOS creation flow
      openDialog(
        <BillingUpgradeSuccessContent
          onClose={() => {
            closeDialog()
          }}
        />
      )
      setCreationAttempted(true)
      addOS.mutate(
        {
          requestBody: {
            endpoint_url: osParams.url!,
            name: osParams.name!,
            tags: osParams.tags || []
          }
        },
        {
          onSuccess: (newOS) => {
            if (newOS) {
              setCurrentOS(newOS)
            }
            setShouldKeepPolling(false)
            cleanUrlParams()
          },
          onError: () => {
            setShouldKeepPolling(false)
            cleanUrlParams()
          }
        }
      )
    } else if (
      osParams.ctx === 'invite-member' &&
      billingStatus?.has_subscription &&
      !inviteMemberDialogShown
    ) {
      // Invite member flow - show success dialog once and clean URL
      setShouldKeepPolling(false)
      setInviteMemberDialogShown(true)
      openDialog(
        <BillingUpgradeSuccessContent
          onClose={() => {
            closeDialog()
          }}
        />
      )
      cleanUrlParams()
    } else if (
      osParams.ctx === 'billing' &&
      billingStatus?.has_subscription &&
      !billingDialogShown
    ) {
      // Generic billing flow
      setShouldKeepPolling(false)
      setBillingDialogShown(true)
      openDialog(
        <BillingUpgradeSuccessContent
          onClose={() => {
            closeDialog()
          }}
        />
      )
      cleanUrlParams()
    }
  }, [
    billingStatus,
    location.search,
    location.pathname,
    openDialog,
    setContent,
    navigate,
    addOS,
    creationAttempted,
    urlCleaned,
    shouldKeepPolling,
    inviteMemberDialogShown,
    billingDialogShown,
    setCurrentOS
  ])

  // Reset shouldKeepPolling when billing status shows no subscription
  useEffect(() => {
    if (billingStatus && !billingStatus.has_subscription && shouldKeepPolling) {
      setShouldKeepPolling(false)
    }
  }, [billingStatus, shouldKeepPolling])

  return null
}

export default UpgradeFlowManager

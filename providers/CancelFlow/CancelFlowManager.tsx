import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDialog } from '@/providers/DialogProvider'
import SuccessDialog from '@/components/pages/CancelPlanPage/Modal/successDialog'

type DecodedCancelParams = {
  from?: string
  ctx: 'cancel-plan'
}

const decodeAndValidateParams = (location: {
  search: string
}): DecodedCancelParams | null => {
  const params = new URLSearchParams(location.search)
  const encoded = params.get('c')

  if (!encoded) return null

  try {
    const decoded = JSON.parse(decodeURIComponent(atob(encoded))) as {
      from?: string
    }

    const from = decoded.from
    const ctx = 'cancel-plan'

    return { from, ctx }
  } catch {
    return null
  }
}

const CancelFlowManager = () => {
  const { openDialog, closeDialog } = useDialog()
  const location = useLocation()
  const navigate = useNavigate()

  const [urlCleaned, setUrlCleaned] = useState(false)
  const [cancelDialogShown, setCancelDialogShown] = useState(false)

  const cleanUrlParams = () => {
    if (!urlCleaned) {
      setUrlCleaned(true)
      const params = new URLSearchParams(location.search)
      params.delete('c')
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

  useEffect(() => {
    const cancelParams = decodeAndValidateParams(location)
    if (!cancelParams) {
      return
    }

    if (cancelParams.ctx === 'cancel-plan' && !cancelDialogShown) {
      // Cancel plan flow - show success dialog once and clean URL
      setCancelDialogShown(true)
      openDialog(
        <SuccessDialog
          onClose={() => {
            closeDialog()
          }}
        />
      )
      cleanUrlParams()
    }
  }, [
    location.search,
    location.pathname,
    openDialog,
    closeDialog,
    navigate,
    urlCleaned,
    cancelDialogShown
  ])

  return null
}

export default CancelFlowManager

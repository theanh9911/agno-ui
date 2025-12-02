import { FC, ReactNode, useEffect } from 'react'
import { useOSQuery } from '@/api/hooks'
import { useOSStore } from '@/stores/OSStore'
import { useOSChangeReset } from '@/hooks/os/useOSChangeReset'

interface OSProviderProps {
  children: ReactNode
}

const OSProvider: FC<OSProviderProps> = ({ children }) => {
  const currentOS = useOSStore((state) => state.currentOS)
  const setCurrentOS = useOSStore((state) => state.setCurrentOS)
  const { data: osList } = useOSQuery()

  // Reset page state whenever OS changes
  useOSChangeReset()

  useEffect(() => {
    if (!osList) return

    // CurrentOS doesn't exist in the current list
    if (currentOS?.id && !osList.some((os) => os.id === currentOS.id)) {
      setCurrentOS(null)
      return
    }

    // Auto-select first AgentOS if no current AgentOS is selected and list has items
    if (!currentOS && osList.length > 0) {
      setCurrentOS(osList[0])
    }
  }, [osList, currentOS?.id, setCurrentOS])

  return <>{children}</>
}

export default OSProvider

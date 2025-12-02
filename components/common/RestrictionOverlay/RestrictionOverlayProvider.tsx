import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react'
import RestrictionOverlay from './RestrictionOverlay'
import { type RestrictionOverlayContextType } from './types'

const RestrictionOverlayContext = createContext<
  RestrictionOverlayContextType | undefined
>(undefined)

export const useRestrictionOverlay = () => {
  const context = useContext(RestrictionOverlayContext)
  if (!context) {
    throw new Error(
      'useRestrictionOverlay must be used within a RestrictionOverlayProvider'
    )
  }
  return context
}

interface RestrictionOverlayProviderProps {
  children: ReactNode
}

const RestrictionOverlayProvider = ({
  children
}: RestrictionOverlayProviderProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [onClose, setOnClose] = useState<(() => void) | undefined>(undefined)

  const show = (newContent: ReactNode, options?: { onClose?: () => void }) => {
    setContent(newContent)
    setOnClose(() => options?.onClose)
    setIsVisible(true)
  }

  const hide = () => {
    setIsVisible(false)
    setContent(null)
    setOnClose(undefined)
  }

  return (
    <RestrictionOverlayContext.Provider
      value={{
        isVisible,
        show,
        hide
      }}
    >
      {children}
      <RestrictionOverlay isVisible={isVisible} onClose={onClose}>
        {content}
      </RestrictionOverlay>
    </RestrictionOverlayContext.Provider>
  )
}

export default RestrictionOverlayProvider

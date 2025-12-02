import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { Dialog } from '@/components/ui/dialog'

type DialogContextValue = {
  openDialog: (content: ReactNode, options?: { onClose?: () => void }) => void
  closeDialog: () => void
  setContent: (content: ReactNode) => void
  isOpen: boolean
  onClose?: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [onCloseCallback, setOnCloseCallback] = useState<
    (() => void) | undefined
  >(undefined)

  const openDialog = useCallback(
    (node: ReactNode, options?: { onClose?: () => void }) => {
      setContent(node)
      setIsOpen(true)
      setOnCloseCallback(() => options?.onClose)
    },
    []
  )

  const setDialogContent = useCallback((node: ReactNode) => {
    setContent(node)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    onCloseCallback?.()
    setTimeout(() => setContent(null), 500)
  }, [onCloseCallback])

  const value = useMemo<DialogContextValue>(
    () => ({
      openDialog,
      closeDialog,
      setContent: setDialogContent,
      isOpen,
      onClose: onCloseCallback
    }),
    [openDialog, closeDialog, setDialogContent, isOpen, onCloseCallback]
  )

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          setIsOpen(next)
          if (!next) {
            onCloseCallback?.()
            setTimeout(() => {
              setContent(null)
              setOnCloseCallback(undefined)
            }, 500)
          }
        }}
      >
        {content}
      </Dialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider')
  return ctx
}

export default DialogProvider

// SheetProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { Sheet, SheetPortal, SheetOverlay } from '@/components/ui/sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/utils/cn'
import { useLastUsedStateStore } from '@/stores/LastUsedStateStore'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/typography/Heading'

type Side = 'left' | 'right' | 'top' | 'bottom'
type SheetRenderer<T = unknown> = (data: T) => ReactNode

type OpenSheetOptions<T = unknown> = {
  side?: Side
  title?: string
  initialData?: T
  id?: string
}

type SheetContextValue = {
  openSheet: <T>(
    nodeOrRenderer: ReactNode | SheetRenderer<T>,
    options?: OpenSheetOptions<T>
  ) => string // <-- returns the id for scoping updates
  closeSheet: () => void
  updateSheetData: <T extends object>(
    next: Partial<T> | ((prev: T) => Partial<T>)
  ) => void
  replaceSheetData: <T>(next: T) => void
  setTitle: (title: string | null) => void
  isOpen: boolean
  isCurrent: (id: string | undefined) => boolean
}

const SheetContext = createContext<SheetContextValue | null>(null)

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState<string | null>(null)
  const [side, setSide] = useState<Side>('right')

  const [renderer, setRenderer] = useState<SheetRenderer<unknown> | null>(null)
  const [sheetData, setSheetData] = useState<unknown>(null)
  const [staticContent, setStaticContent] = useState<ReactNode | null>(null)

  // Sheet ID to prevent updating the wrong sheet
  const [currentId, setCurrentId] = useState<string | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const ignoreOutsideUntilRef = useRef<number>(0)

  const sheetWidth = useLastUsedStateStore((s) => s.sheetWidth)
  const setSheetWidth = useLastUsedStateStore((s) => s.setSheetWidth)

  const clearDeferred = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const openSheet = useCallback(
    <T,>(
      nodeOrRenderer: ReactNode | SheetRenderer<T>,
      options?: OpenSheetOptions<T>
    ) => {
      clearDeferred()
      // Suppress outside-close for a brief period after open to avoid
      // conflicts with the triggering click from menus/popovers
      ignoreOutsideUntilRef.current = Date.now() + 400
      const id = options?.id ?? crypto.randomUUID()
      setCurrentId(id)
      setSide(options?.side ?? 'right')
      setTitle(options?.title ?? null)
      setIsOpen(true)

      if (typeof nodeOrRenderer === 'function') {
        setRenderer(() => nodeOrRenderer as SheetRenderer<unknown>)
        setStaticContent(null)
        setSheetData(options?.initialData ?? null)
      } else {
        setRenderer(null)
        setSheetData(null)
        setStaticContent(nodeOrRenderer)
      }
      return id
    },
    []
  )

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    clearDeferred()
    timeoutRef.current = setTimeout(() => {
      setRenderer(null)
      setSheetData(null)
      setStaticContent(null)
      setTitle(null)
      setCurrentId(null) // <-- reset owner
    }, 500)
  }, [])

  const updateSheetData = useCallback(
    <T extends object>(next: Partial<T> | ((prev: T) => Partial<T>)) => {
      setSheetData((prev: T) => {
        const patch =
          typeof next === 'function'
            ? (next as (p: T) => Partial<T>)(prev)
            : next
        if (prev && typeof prev === 'object') return { ...prev, ...patch }
        return patch
      })
    },
    []
  )

  const replaceSheetData = useCallback(<T,>(next: T) => {
    setSheetData(next)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sheetRef.current) return
      if (side === 'right') {
        const newWidth = window.innerWidth - e.clientX
        setSheetWidth(`${Math.max(300, Math.min(800, newWidth))}px`)
      } else if (side === 'left') {
        const newWidth = e.clientX
        setSheetWidth(`${Math.max(300, Math.min(800, newWidth))}px`)
      }
    },
    [isDragging, side, setSheetWidth]
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      document.body.style.cursor = ''
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => () => clearDeferred(), [])

  const value = useMemo<SheetContextValue>(
    () => ({
      openSheet,
      closeSheet,
      updateSheetData,
      replaceSheetData,
      setTitle: (newTitle: string | null) => setTitle(newTitle),
      isOpen,
      isCurrent: (id?: string) => !!id && id === currentId // <-- expose guard
    }),
    [
      openSheet,
      closeSheet,
      updateSheetData,
      replaceSheetData,
      isOpen,
      currentId
    ]
  )

  // Get content from the renderer or the static content
  const content = useMemo(() => {
    if (renderer) return renderer(sheetData)
    return staticContent
  }, [renderer, sheetData, staticContent])

  return (
    <SheetContext.Provider value={value}>
      {children}
      <Sheet
        open={isOpen}
        modal={false}
        onOpenChange={(next) => {
          // Ignore close requests that happen immediately after open
          // (e.g., from a dropdown/popup click bubbling). This gives the
          // sheet time to mount before responding to outside interactions.
          if (!next && Date.now() < ignoreOutsideUntilRef.current) {
            return
          }
          setIsOpen(next)
          if (!next) {
            clearDeferred()
            timeoutRef.current = setTimeout(() => {
              setRenderer(null)
              setSheetData(null)
              setStaticContent(null)
              setTitle(null)
              setCurrentId(null)
            }, 500)
          }
        }}
      >
        <SheetPortal>
          <SheetOverlay />
          <SheetPrimitive.Content
            ref={sheetRef}
            className={cn(
              'fixed z-50 overflow-y-auto bg-background shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
              side === 'right' &&
                'bottom-0 right-0 top-14 border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
              side === 'left' &&
                'bottom-0 left-0 top-16 border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
              side === 'top' &&
                'inset-x-0 top-16 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
              side === 'bottom' &&
                'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
            )}
            style={{
              width:
                side === 'left' || side === 'right' ? sheetWidth : undefined,
              height:
                side === 'top' || side === 'bottom' ? sheetWidth : undefined
            }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {title && (
              <SheetPrimitive.Title className="header-gradient absolute left-0 z-20 w-full truncate pr-16">
                <Heading size={3} className="text-primary">
                  {title}
                </Heading>
              </SheetPrimitive.Title>
            )}
            <SheetPrimitive.Description className="sr-only">
              {title ? `${title} panel` : 'Side panel'}
            </SheetPrimitive.Description>

            {/* Full-bleed layer for resizer + scroller */}
            <div className="absolute inset-0">
              {(side === 'left' || side === 'right') && (
                <div
                  className={cn(
                    'group absolute bottom-0 top-0 z-30 flex w-1.5 cursor-col-resize items-center justify-center',
                    side === 'right' ? 'left-0' : 'right-0'
                  )}
                  onMouseDown={handleMouseDown}
                >
                  {/* Hover area with expanded width */}
                  <div className="pointer-events-none absolute inset-0 bg-border opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  {/* Primary color selector in the center */}
                  <div
                    className={cn(
                      'pointer-events-none h-6 w-0.5 rounded-sm bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                      side === 'left'
                        ? '-mr-[0.75px]'
                        : side === 'right'
                          ? '-ml-[0.75px]'
                          : 'm-0'
                    )}
                  />
                </div>
              )}

              <div
                className={cn(
                  'absolute inset-0 overflow-y-auto',
                  title && 'pt-12'
                )}
              >
                <div className="min-h-full p-6 pt-8">{content}</div>
              </div>
            </div>

            <SheetPrimitive.Close className="absolute right-6 top-4 z-20 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <Button
                variant="secondary"
                size="iconXs"
                className="size-9 p-0"
                icon="close"
              />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          </SheetPrimitive.Content>
        </SheetPortal>
      </Sheet>
    </SheetContext.Provider>
  )
}

export const useSheet = () => {
  const ctx = useContext(SheetContext)
  if (!ctx) throw new Error('useSheet must be used within a SheetProvider')
  return ctx
}

export default SheetProvider

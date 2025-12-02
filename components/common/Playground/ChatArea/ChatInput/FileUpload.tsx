import NumberFlow from '@number-flow/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/Paragraph'
import { processAndAddFiles } from '@/utils/playgroundUtils'
import { type FileData, useUploadFileStore } from '@/stores/playground'
import { usePlaygroundQueries } from '@/hooks/playground/usePlaygroundQueries'
import { cn } from '@/utils/cn'
import { FilePreview } from './FilePreview'

const FileCount = ({ files }: { files: FileData[] }) => {
  const { clearFiles } = useUploadFileStore()
  return (
    files.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between gap-x-2"
      >
        <Paragraph size="mono" className="uppercase text-primary/50">
          <NumberFlow value={files.length} format={{ notation: 'compact' }} />{' '}
          {files.length > 1 ? 'files' : 'file'} attached
        </Paragraph>
        <button type="button" onClick={clearFiles}>
          <Paragraph
            size="mono"
            className="flex items-center gap-x-1 uppercase text-primary"
          >
            <X size={14} />
            clear {files.length > 1 ? 'all' : ''}
          </Paragraph>
        </button>
      </motion.div>
    )
  )
}

const FileItems = ({
  files,
  removeFile
}: {
  files: FileData[]
  removeFile: (index: number) => void
}) => {
  // Reference to the horizontal scrolling container
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Calculates whether there is overflow content on either side
  const updateScrollShadows = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
  }

  useEffect(() => {
    updateScrollShadows()
  }, [files?.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onResize = () => updateScrollShadows()
    // Keep shadows in sync on container resize and window resize
    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize)
      ro?.observe?.(el)
    }
    // Update shadows while the user scrolls
    el.addEventListener('scroll', updateScrollShadows, { passive: true })
    window?.addEventListener?.('resize', onResize)
    return () => {
      el.removeEventListener('scroll', updateScrollShadows)
      window?.removeEventListener?.('resize', onResize)
      ro?.unobserve?.(el)
      ro?.disconnect?.()
    }
  }, [])

  const EdgeFade = ({ side }: { side: 'left' | 'right' }) => (
    <div
      className={`pointer-events-none absolute ${side === 'left' ? 'left-0' : 'right-0'} top-0 z-10 h-full w-8`}
      style={{
        background: `linear-gradient( ${side === 'left' ? '90deg' : '270deg'}, var(--color-primary-accent-100, #18181B) 0%, var(--color-primary-accent-10, rgba(24, 24, 27, 0.10)) 100%)`
      }}
    />
  )

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={updateScrollShadows}
        className="hide-scrollbar flex items-start justify-start gap-x-2 overflow-x-auto"
      >
        {files.map((file, index) => (
          <motion.div
            key={`${file.preview}-${file.file.lastModified}`}
            className="relative shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + index * 0.1,
              type: 'spring',
              damping: 20,
              stiffness: 300
            }}
          >
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="-top-1.0 absolute -right-1.5 rounded-full bg-muted/50 p-0.5 text-accent"
            >
              <X size={14} />
            </button>
            <FilePreview file={file} />
          </motion.div>
        ))}
      </div>

      {canScrollLeft && <EdgeFade side="left" />}
      {canScrollRight && <EdgeFade side="right" />}
    </div>
  )
}
interface FileUploadProps {
  showBanner?: boolean
  showTrigger?: boolean
  disabled?: boolean
  className?: string
}
const FileUpload = ({
  showBanner = true,
  showTrigger = true,
  disabled = false,
  className
}: FileUploadProps) => {
  const { selectedId } = usePlaygroundQueries()
  const { files, addFile, removeFile } = useUploadFileStore()

  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(files.length > 0)
  }, [files.length])
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processAndAddFiles(selectedFiles, files, addFile)
    e.target.value = ''
  }
  const acceptedFileTypes =
    '.pdf,.csv,.json,.txt,.doc,.docx,.jpg,.png,.webp,.jpeg,.wav,.mp3,.mp4,.webm,.flv,.mov,.mpeg,.mpg,.wmv,.3gp'
  return (
    <>
      {showBanner && (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 86,
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2, delay: 0.1 }
                }
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2 }
                }
              }}
              className={cn(
                'z-0 flex flex-col gap-3 overflow-hidden rounded-t-md bg-secondary/50',
                className
              )}
            >
              <FileCount files={files} />
              <FileItems files={files} removeFile={removeFile} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {/* File Upload Input */}
      {showTrigger && (
        <div className="cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept={acceptedFileTypes}
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            icon="paperclip"
            size="iconSm"
            variant="outline"
            className="size-8 shrink-0"
            disabled={!selectedId || disabled}
          />
        </div>
      )}
    </>
  )
}
export default FileUpload

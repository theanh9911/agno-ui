import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

import Paragraph from '@/components/ui/typography/Paragraph'

import { cn } from '@/utils/cn'
import { useLastUsedStateStore } from '@/stores/LastUsedStateStore'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  totalSessions?: number
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalSessions,
  pageSize
}) => {
  const sidebarWidth = useLastUsedStateStore(
    (state) => state.sessionSidebarWidth
  )
  const [pageValue, setPageValue] = useState<string | number>(currentPage)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPageValue(currentPage)
  }, [currentPage])

  const handleInputBlur = useCallback(() => {
    const newPage = Math.min(
      Math.max(Number(pageValue) || currentPage, 1),
      totalPages
    )
    if (newPage !== currentPage) {
      onPageChange(newPage)
    } else {
      setPageValue(newPage)
    }
  }, [pageValue, currentPage, onPageChange, totalPages])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        handleInputBlur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleInputBlur])

  return (
    <div className="relative flex w-full items-center justify-center">
      {/* Previous button */}
      <Button
        variant="icon"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon="caret-left"
      />

      <div className="flex h-9 w-fit items-center rounded-md border border-border px-3 py-1 tabular-nums">
        <input
          ref={inputRef}
          className={cn(
            'mr-0 bg-transparent text-center font-inter text-sm tracking-[-0.28px] text-primary outline-none'
          )}
          value={pageValue}
          style={{
            width: `calc(${pageValue.toString().length}ch + ${
              pageValue.toString().length * 0.2
            }em)`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              inputRef.current?.blur()
              handleInputBlur()
            }
          }}
          onBlur={() => {
            handleInputBlur()
          }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '')
            setPageValue(value === '' ? '' : Number(value))
          }}
        />
        <span className="text-sm text-primary/50">/</span>
        <span className="font-inter text-sm tracking-[-0.28px] text-primary/50">
          {totalPages}
        </span>
      </div>

      {/* Next button */}
      <Button
        variant="icon"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon="caret-right"
      />

      {totalSessions && parseInt(sidebarWidth, 10) > 492 && (
        <div className="absolute right-4">
          <Paragraph size="mono" className="uppercase text-primary/50">
            Showing{' '}
            {currentPage === totalPages
              ? Math.min(
                  pageSize,
                  totalSessions
                    ? totalSessions - pageSize * (currentPage - 1)
                    : 0
                )
              : pageSize}{' '}
            of {totalSessions ?? 0} sessions
          </Paragraph>
        </div>
      )}
    </div>
  )
}

export default memo(Pagination)

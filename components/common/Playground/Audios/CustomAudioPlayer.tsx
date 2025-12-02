import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import Icon from '@/components/ui/icon'
import { cn } from '@/utils/cn'
import { formatTime } from '@/utils/audio'
import DownloadButton from '../../DownloadButton'
import { toast } from '@/components/ui/toast'

interface CustomAudioPlayerProps {
  src: string
  className?: string
}

type PlayerState = {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

type ProgressState = {
  isDragging: boolean
}

type DownloadState = 'idle' | 'loading' | 'success' | 'error'

type PlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_VOLUME' }
  | { type: 'RESET' }

const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action?.type) {
    case 'PLAY':
      return { ...state, isPlaying: true }
    case 'PAUSE':
      return { ...state, isPlaying: false }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'TOGGLE_VOLUME':
      return { ...state, volume: state.volume === 1 ? 0 : 1 }
    case 'RESET':
      return { ...state, isPlaying: false, currentTime: 0 }
    default:
      return state
  }
}

export const CustomAudioPlayer = ({
  src,
  className
}: CustomAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const [playerState, dispatch] = useReducer(playerReducer, {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  })

  const [progressState, setProgressState] = useState<ProgressState>({
    isDragging: false
  })

  const [downloadState, setDownloadState] = useState<DownloadState>('idle')

  const { isPlaying, currentTime, duration, volume } = playerState
  const { isDragging } = progressState

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () =>
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime })
    const handleLoadedMetadata = () =>
      dispatch({ type: 'SET_DURATION', payload: audio.duration })
    const handleEnded = () => dispatch({ type: 'PAUSE' })

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      dispatch({ type: 'PAUSE' })
    } else {
      audioRef.current.play()
      dispatch({ type: 'PLAY' })
    }
  }, [isPlaying])

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setProgressState((prev) => ({ ...prev, isDragging: true }))
    handleProgressBarClick(e)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pos * duration
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !progressBarRef.current || !audioRef.current) return
      const rect = progressBarRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const percentage = x / rect.width
      const newTime = percentage * duration
      audioRef.current.currentTime = newTime
    },
    [isDragging, duration]
  )

  const handleMouseUp = useCallback(() => {
    setProgressState((prev) => ({ ...prev, isDragging: false }))
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleVolumeChange = useCallback(() => {
    if (!audioRef.current) return
    const newVolume = volume === 1 ? 0 : 1
    audioRef.current.volume = newVolume
    dispatch({ type: 'TOGGLE_VOLUME' })
  }, [volume])

  const handleDownload = useCallback(async () => {
    try {
      setDownloadState('loading')
      const [response] = await Promise.all([
        fetch(src),
        new Promise((resolve) => setTimeout(resolve, 1000))
      ])
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audio-${Date.now()}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setDownloadState('success')
      setTimeout(() => setDownloadState('idle'), 2000)
    } catch (error) {
      setDownloadState('error')
      setTimeout(() => setDownloadState('idle'), 2000)
      toast.error({
        description: `Failed to download audio: ${error instanceof Error ? error.message : ''}`
      })
    }
  }, [src])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isPlaying && audioRef.current) {
        audioRef.current.pause()
        dispatch({ type: 'RESET' })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying])

  return (
    <div
      className={cn(
        'flex h-[3.25rem] max-w-[24rem] items-center rounded-lg border border-border px-2',
        className
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onError={(e) => {
          const parent = e.currentTarget.parentElement?.parentElement
          if (parent) {
            const linkHtml = src
              ? `<a href="${src}" target="_blank" class="max-w-md truncate underline text-primary text-xs w-full">${src}</a>`
              : ''
            parent.innerHTML = `
             <div class="flex rounded-lg size-fit  p-2 text-center flex-col items-center justify-center gap-2  bg-secondary/50 text-muted">
                      <p class="text-primary text-xs">Audio unavailable</p>
                      ${linkHtml}
                    </div>
            `
          }
        }}
      />
      <div className="mr-1 flex size-9 items-center justify-center rounded-md bg-brand">
        <Icon type="headphones" className="text-white" size="sm" />
      </div>
      {/* Start of Selection */}
      <div className="flex flex-1 items-center gap-2">
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <Icon
            type={isPlaying ? 'pause' : 'play'}
            className="text-primary"
            size="xs"
          />
        </button>
        <div className="text-sm text-primary">{formatTime(currentTime)}</div>
        <div
          ref={progressBarRef}
          className="group relative h-1 flex-1 cursor-pointer rounded-full bg-primary/10"
          onMouseDown={handleProgressBarMouseDown}
        >
          <div
            className="absolute left-0 h-full rounded-full bg-brand transition-all duration-100 ease-out"
            style={{
              width: `${(currentTime / duration) * 100}%`,
              transition: isDragging ? 'none' : 'all 100ms ease-out'
            }}
          >
            <div
              className={`absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-brand shadow-md transition-opacity duration-150 ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            />
          </div>
        </div>
        <div className="text-sm text-primary">{formatTime(duration)}</div>
        <button
          onClick={handleVolumeChange}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80"
          aria-label="Toggle volume"
        >
          <Icon
            type={volume === 0 ? 'volume-x' : 'volume-2'}
            className="text-primary"
            size="xs"
          />
        </button>
      </div>
      {/* End */}
      <DownloadButton
        onDownload={handleDownload}
        downloadState={downloadState}
      />
    </div>
  )
}

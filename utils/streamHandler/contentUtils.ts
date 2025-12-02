import {
  RunResponseContent,
  ImageData,
  VideoData,
  AudioData
} from '@/types/Agent'
import { PlaygroundMessage } from '@/types/playground'
import { getJsonMarkdown } from '@/utils/playgroundUtils'
import { FileData } from '@/stores/playground'

interface ContentProcessingResult {
  newContent: string
  newLastContent: string
  newAudio?: { transcript: string }
}

export interface ProcessedMediaFiles {
  images?: ImageData[]
  videos?: VideoData[]
  audios?: AudioData[]
}

export const contentUtils = {
  processContentChunk: (
    chunk: RunResponseContent,
    lastContent: string,
    existingContent: string = '',
    existingAudio?: { transcript?: string }
  ): ContentProcessingResult => {
    if (typeof chunk?.content === 'string') {
      // For incremental content, append the chunk content directly
      return {
        newContent: existingContent + chunk.content,
        newLastContent: (lastContent || '') + chunk.content
      }
    }

    if (
      chunk.response_audio?.transcript &&
      typeof chunk.response_audio.transcript === 'string'
    ) {
      const transcript = chunk.response_audio.transcript
      const existingTranscript = existingAudio?.transcript || ''
      return {
        newContent: existingContent,
        newLastContent: lastContent,
        newAudio: {
          transcript: existingTranscript + transcript
        }
      }
    }

    if (typeof chunk?.content === 'object' && chunk?.content !== null) {
      const jsonBlock = getJsonMarkdown(chunk.content)
      return {
        newContent: existingContent + jsonBlock,
        newLastContent: jsonBlock
      }
    }

    return {
      newContent: existingContent,
      newLastContent: lastContent
    }
  },

  handleContentUpdate: (
    message: PlaygroundMessage,
    chunk: RunResponseContent
  ): PlaygroundMessage => {
    // Create a new message object to ensure React detects the change
    const updatedMessage = { ...message }

    // Directly append incremental content
    if (typeof chunk.content === 'string') {
      updatedMessage.content = (message.content || '') + chunk.content
    }

    // Handle audio transcript if present
    if (chunk.response_audio?.transcript) {
      if (!updatedMessage.response_audio) {
        updatedMessage.response_audio = { transcript: '' }
      } else {
        updatedMessage.response_audio = { ...updatedMessage.response_audio }
      }
      updatedMessage.response_audio.transcript =
        (updatedMessage.response_audio.transcript || '') +
        chunk.response_audio.transcript
    }

    // Update timestamps and extra data
    if (chunk.created_at) {
      updatedMessage.created_at = chunk.created_at
    }

    if (chunk.extra_data) {
      updatedMessage.extra_data = {
        ...updatedMessage.extra_data,
        ...chunk.extra_data
      }
    }

    // Handle media files
    if (chunk.images) updatedMessage.images = chunk.images
    if (chunk.videos) updatedMessage.videos = chunk.videos
    if (chunk.audio) updatedMessage.audio = chunk.audio

    return updatedMessage
  },

  processChunkForIntermediateSteps: (
    chunk: RunResponseContent
  ): RunResponseContent => {
    const processedChunk = { ...chunk }

    // Only normalize content if it's an object and NOT a reasoning event
    if (chunk.content && typeof chunk.content === 'object') {
      const isReasoningEvent =
        chunk.event.includes('ReasoningCompleted') ||
        chunk.event.includes('ReasoningStep')

      if (!isReasoningEvent) {
        const { newContent } = contentUtils.processContentChunk(chunk, '', '')
        processedChunk.content = newContent
      }
      // For reasoning events, preserve object content structure
    }

    return processedChunk
  },

  convertFilesToImages: (files: FileData[]): ImageData[] => {
    return files
      .filter((fileData) => fileData.file.type.startsWith('image/'))
      .map(({ file, preview }, index) => ({
        url: preview || '',
        id: `image-${file.lastModified}-${index}`,
        mime_type: file.type
      }))
  },

  convertFilesToVideos: (files: FileData[]): VideoData[] => {
    return files
      .filter((fileData) => fileData.file.type.startsWith('video/'))
      .map(({ file, preview }, index) => ({
        url: preview || '',
        id: `video-${file.lastModified}-${index}`,
        mime_type: file.type
      }))
  },

  convertFilesToAudio: (files: FileData[]): AudioData[] => {
    return files
      .filter((fileData) => fileData.file.type.startsWith('audio/'))
      .map(({ file, preview }, index) => ({
        url: preview || '',
        id: `audio-${file.lastModified}-${index}`,
        mime_type: file.type
      }))
  },

  convertFilesToMediaTypes: (files: FileData[]): ProcessedMediaFiles => {
    const images = contentUtils.convertFilesToImages(files)
    const videos = contentUtils.convertFilesToVideos(files)
    const audios = contentUtils.convertFilesToAudio(files)

    return {
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      audios: audios.length > 0 ? audios : undefined
    }
  }
}

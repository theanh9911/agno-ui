import { IconType } from '@/components/ui/icon'
import {
  KnowledgeDocument,
  ContentType,
  DocumentTypeEnums,
  ContentItem,
  FileTypeKey
} from '@/types/Knowledge'
import { AcceptedFileTypes, DIALOG_STYLES } from './constant'

// Define the form item type for duplicate detection

export const hasDuplicateName = (
  allItems: ContentItem[] | undefined,
  currentName: string | undefined,
  currentIndex: number
): boolean => {
  if (!allItems || !currentName) return false

  const currentNameLower = currentName.trim().toLowerCase()
  const nameCount = allItems.filter(
    (item, index) =>
      item?.name?.trim().toLowerCase() === currentNameLower &&
      index !== currentIndex
  ).length

  return nameCount > 0
}

export const getContentTypeIcon = (
  fileType: string | null | undefined
): IconType => {
  if (!fileType) {
    return 'file'
  }

  const type = fileType.toLowerCase()
  const iconMap: Record<string, IconType> = {
    [DocumentTypeEnums.MANUAL]: 'input',
    [DocumentTypeEnums.URL]: 'globe',
    [DocumentTypeEnums.DEFAULT]: 'file',
    [DocumentTypeEnums.TOPIC]: 'search-check'
  }
  return iconMap[type] || iconMap[DocumentTypeEnums.DEFAULT]
}

export const getFileType = (fileType: string | null | undefined): string => {
  if (!fileType) {
    return 'file'
  }

  const type = fileType.toLowerCase()
  const typeMap: Record<string, string> = {
    [DocumentTypeEnums.MANUAL]: 'Text',
    [DocumentTypeEnums.URL]: 'Web',
    [DocumentTypeEnums.TOPIC]: 'Topic',
    [DocumentTypeEnums.DEFAULT]: 'File'
  }
  return typeMap[type] || typeMap[DocumentTypeEnums.DEFAULT]
}
export const isFileTypeSupported = (file: File) => {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  return AcceptedFileTypes.split(',').some((type) => type.trim() === extension)
}
export const getFileTypeDisplay = (type?: string) => {
  type = type?.includes('/') ? type.split('/')[1] : type
  if (!type) return ''
  const typeMap: Record<string, string> = {
    [DocumentTypeEnums.MANUAL]: 'TEXT',
    [DocumentTypeEnums.URL]: 'WEB'
  }
  return typeMap[type] || type.toUpperCase()
}
export const getDocumentMetadata = (
  documentData?: KnowledgeDocument | null
): Record<string, string> => {
  if (!documentData?.metadata) return {}

  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(documentData.metadata)) {
    if (typeof value === 'string') {
      result[key] = value
    }
  }
  return result
}

export const metadataTags = (document: KnowledgeDocument) =>
  Object.entries(getDocumentMetadata(document)).map(
    ([key, value]) => `${key} = ${value}`
  )

export const getDialogStyles = (contentType: ContentType | null) =>
  contentType === ContentType.TEXT ? DIALOG_STYLES.TEXT : DIALOG_STYLES.DEFAULT

// Helper function to get file extension
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.slice(lastDotIndex).toLowerCase()
}

// Helper function to check if a URL is a YouTube link
export const isYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    return hostname.includes('youtube')
  } catch {
    return false
  }
}

// Helper function to validate URL and raise error if it has file extension
export const validateUrlWithoutFileExtension = (url: string): boolean => {
  const urlObj = new URL(url)
  const pathname = urlObj.pathname
  const extension = getFileExtension(pathname)
  return !extension // return true if no extension, false if extension exists
}

//TODO : Refactor this function postLaunch

// Helper function to determine the file type key for typesOfReaders mapping
export const getFileTypeKey = (
  contentType: ContentType | null,
  currentItem?: ContentItem | null
): FileTypeKey[] => {
  if (contentType === ContentType.TEXT) {
    return [FileTypeKey.TEXT]
  }

  if (contentType === ContentType.WEB) {
    // Check if it's a YouTube URL when we have the current item
    if (currentItem?.url && isYouTubeUrl(currentItem?.url)) {
      return [FileTypeKey.YOUTUBE]
    }
    return [FileTypeKey.URL]
  }

  if (currentItem?.type === 'url' && currentItem?.url) {
    // Check if it's a YouTube URL first
    if (isYouTubeUrl(currentItem?.url)) {
      return [FileTypeKey.YOUTUBE]
    }

    // Check if the URL points to a specific file type
    const urlExtension = getFileExtension(currentItem?.url)

    if (urlExtension) {
      // URL has file extension - return specific file type + URL
      const extensionMap: Record<string, FileTypeKey[]> = {
        '.pdf': [FileTypeKey.PDF, FileTypeKey.URL],
        '.doc': [FileTypeKey.DOC, FileTypeKey.URL],
        '.docx': [FileTypeKey.DOCX, FileTypeKey.URL],
        '.txt': [FileTypeKey.TEXT, FileTypeKey.URL],
        '.csv': [FileTypeKey.CSV, FileTypeKey.URL],
        '.json': [FileTypeKey.JSON, FileTypeKey.URL],
        '.md': [FileTypeKey.MD, FileTypeKey.URL],
        '.xlsx': [FileTypeKey.XLSX, FileTypeKey.URL],
        '.pptx': [FileTypeKey.PPTX, FileTypeKey.URL]
      }

      return extensionMap[urlExtension] || [FileTypeKey.URL]
    } else {
      // URL without extension - could be any file type, return URL first as default
      return [
        FileTypeKey.URL,
        FileTypeKey.PDF,
        FileTypeKey.DOC,
        FileTypeKey.DOCX,
        FileTypeKey.TEXT,
        FileTypeKey.CSV,
        FileTypeKey.JSON,
        FileTypeKey.MD,
        FileTypeKey.XLSX,
        FileTypeKey.PPTX
      ]
    }
  }

  if (currentItem?.type === 'file' && currentItem?.file) {
    const extension = getFileExtension(currentItem.file.name)
    // Map common extensions to specific FileTypeKey values
    const extensionMap: Record<string, FileTypeKey> = {
      '.pdf': FileTypeKey.PDF,
      '.doc': FileTypeKey.DOC,
      '.docx': FileTypeKey.DOCX,
      '.txt': FileTypeKey.TEXT,
      '.csv': FileTypeKey.CSV,
      '.json': FileTypeKey.JSON,
      '.md': FileTypeKey.MD,
      '.xlsx': FileTypeKey.XLSX,
      '.pptx': FileTypeKey.PPTX
    }

    return extensionMap[extension]
      ? [extensionMap[extension]]
      : [FileTypeKey.TEXT]
  }

  return [FileTypeKey.TEXT]
}

export const getModalContent = (contentType: ContentType | null) => {
  switch (contentType) {
    case ContentType.FILE:
      return {
        title: 'Add file content to the knowledge base',
        description: 'You can add multiple files'
      }
    case ContentType.TEXT:
      return {
        title: 'Add text content to the knowledge base'
      }
    case ContentType.WEB:
      return {
        title: 'Add web content to the knowledge base',
        description: 'You can add multiple urls'
      }
    default:
      return null
  }
}

import { ContentType } from '@/types/Knowledge'

export const AcceptedFileTypes =
  '.pdf,.csv,.json,.txt,.doc,.docx,.md,.rtf,.html,.htm,.xml,.xlsx,.xls,.pptx'

export const DIALOG_STYLES = {
  DEFAULT: {
    maxWidth: 'clamp(62.5rem, 52.083vw, 52.083vw)',
    maxHeight: '57.8vh'
  },
  TEXT: {
    maxWidth: 'clamp(30rem, 25vw, 25vw)',
    maxHeight: '58.7vh'
  }
} as const

interface ContentOption {
  type: ContentType
  icon: keyof typeof import('@/components/ui/icon/constants').ICONS
  title: string
  description: string
  tooltipInfo: string
}

export const UploadSelectorContentOptions: ContentOption[] = [
  {
    type: ContentType.FILE,
    icon: 'file-type-2',
    title: 'FILE',
    description: 'Upload documents from your computer',
    tooltipInfo:
      'Upload documents, images and other files to the knowledge base.'
  },
  {
    type: ContentType.WEB,
    icon: 'globe',
    title: 'WEB',
    description: 'Add content from websites and URLs',
    tooltipInfo: 'Add web pages to the knowledge base by entering their URLs.'
  },
  {
    type: ContentType.TEXT,
    icon: 'input',
    title: 'TEXT',
    description: 'Create content by typing or pasting text',
    tooltipInfo: 'Add text content to the knowledge base.'
  }
]

import { toast } from '@/components/ui/toast'

/**
 * Downloads media file (image or video) to user's device
 * Handles both base64 data URLs and regular URLs
 */
export const downloadMedia = async (
  src: string,
  mediaType: 'image' | 'video',
  mimeType?: string
) => {
  try {
    toast.loading({
      description: `Downloading ${mediaType}...`
    })

    const response = await fetch(src)
    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()
    const extension =
      mimeType?.split('/')[1] || (mediaType === 'video' ? 'mp4' : 'png')
    const fileName = `${mediaType}-${Date.now()}.${extension}`

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.dismiss()
    toast.success({
      description: `${mediaType} downloaded successfully`
    })
  } catch {
    toast.dismiss()
    toast.error({
      description: `Failed to download ${mediaType}`
    })
  }
}

import Icon from '@/components/ui/icon'
import Paragraph from '@/components/ui/typography/Paragraph'
import { type FileData } from '@/stores/playground'
import Image from '@/components/ui/Image'
import { type IconType } from '@/components/ui/icon/types'

type FilePreviewProps = {
  file: FileData
}

export const FilePreview = ({ file }: FilePreviewProps) => {
  const type = file?.file?.type ?? ''

  if (type.startsWith('image/')) {
    return (
      <Image
        width={69}
        height={54}
        src={file.preview ?? ''}
        alt={file?.file?.name ?? ''}
        className="h-[54px] w-[69px] rounded-sm object-cover"
      />
    )
  }

  let iconType: IconType
  switch (true) {
    case type.startsWith('audio/'):
      iconType = 'file-audio'
      break
    case type.startsWith('video/'):
      iconType = 'file-video'
      break
    default:
      iconType = 'file-type-2'
  }

  return (
    <div className="flex h-[54px] items-center justify-center gap-x-2 rounded-sm border border-border bg-background px-3">
      <div className="flex items-center justify-center rounded-sm bg-primary/5 p-1.5">
        <Icon type={iconType} className="text-primary" />
      </div>
      <div>
        <Paragraph className="w-32 truncate text-sm text-primary">
          {file?.file?.name}
        </Paragraph>
        <Paragraph size="mono" className="uppercase text-primary/50">
          {type}
        </Paragraph>
      </div>
    </div>
  )
}

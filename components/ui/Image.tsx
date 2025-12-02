import { forwardRef, ImgHTMLAttributes } from 'react'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  priority?: boolean
  fill?: boolean
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, width, height, priority, fill, style, ...props }, ref) => {
    const imgStyle = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && {
        height: typeof height === 'number' ? `${height}px` : height
      }),
      ...(fill && {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const
      })
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={imgStyle}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    )
  }
)

Image.displayName = 'Image'

export default Image

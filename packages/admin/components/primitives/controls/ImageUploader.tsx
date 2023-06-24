import { ComponentProps, HTMLProps, useState } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

export type ImageContents = typeof FileReader.prototype.result
export type ImageUploaderProps = {
  currentSrc: string
  onImageLoad?: (file: File, contents: ImageContents) => void
  asComponent?: React.FC<ComponentProps<'img'>> | 'img'
} & HTMLProps<HTMLImageElement>

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentSrc,
  asComponent,
  onImageLoad,
  className,
  ...rest
}) => {
  const ImgComponent = asComponent || 'img'
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState<boolean>(false)

  const handleImageLoad = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      // when read is done, set the preview image url
      setPreviewImageUrl(reader.result as string)
      setShowOverlay(false)
      onImageLoad?.(file, reader.result)
    }

    reader.readAsDataURL(file)
  }

  const handleImageUpload2 = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/upload-url', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.imageUrl
        setPreviewImageUrl(imageUrl)
        setShowOverlay(false)
      } else {
        console.error('Image upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
    }
  }

  const handleImageClick = () => {
    // Trigger the file input when the existing image is clicked
    if (previewImageUrl === null) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'

      input.onchange = e => {
        const files = (e.target as HTMLInputElement).files
        if (files && files.length > 0) {
          handleImageLoad(files[0])
        }
      }

      input.click()
    } else {
      // Handle the click event on the preview image if an image is already selected
      // You can implement custom logic here, such as opening a lightbox or modal
      console.log('Preview image clicked')
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      handleImageLoad(files[0])
    }

    setShowOverlay(false)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setShowOverlay(true)
  }

  const handleDragLeave = () => {
    setShowOverlay(false)
  }

  return (
    <div
      className={'image-uploader inline-flex cursor-pointer relative'}
      onClick={handleImageClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="image-container flex justify-center items-center">
        {previewImageUrl ? (
          <ImgComponent className={cn(className)} {...rest} src={previewImageUrl} alt="preview" />
        ) : (
          <ImgComponent className={cn(className)} {...rest} src={currentSrc} alt="current" />
        )}
        {showOverlay && (
          <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-yellow-400/40" />
        )}
      </div>
    </div>
  )
}

export { ImageUploader }

import { PanelPhonesGallery } from '@/components/Blocks/PanelPhonesGallery/PanelPhonesGallery'
import { Media } from '@/payload-types'

export interface PanelPhonesGalleryBlockPropsType {
  header: any
  galleryArray: {
    image: Media
    description: {
      icon: string
      header: string
      subheader: string
      description: string
    }
  }[]
}

export const PanelPhonesGalleryBlock: React.FC<PanelPhonesGalleryBlockPropsType> = (props) => {
  return <PanelPhonesGallery {...props} />
}

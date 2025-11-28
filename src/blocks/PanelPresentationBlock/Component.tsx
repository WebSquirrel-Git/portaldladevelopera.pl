import { PanelPresentation } from '@/components/Blocks/PanelPresentation/PanelPresentation'
import { Media } from '@/payload-types'

export interface PanelPresentationBlockPropsType {
  header: string
  slidesArray: {
    slide: {
      header: any
      //   header:{
      //     normal:string;
      // gradient:string;
      //   },
      slideList: {
        slideListDescription: any
      }[]
      image: Media
    }
  }[]
}

export const PanelPresentationBlock: React.FC<PanelPresentationBlockPropsType> = (props) => {
  return <PanelPresentation {...props} />
}

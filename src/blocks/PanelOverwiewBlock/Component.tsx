import { PanelOverwiew } from '@/components/Blocks/PanelOverwiew/PanelOverwiew'

export interface PanelOverwiewBlockPropsType {
  tagsList: {
    icon: string
    title: string
  }[]
  description: string
  button: {
    title: string
    url: string
  }
  testimonialsList: {
    stars: number
    testimonial: string
  }[]
}

export const PanelOverwiewBlock: React.FC<PanelOverwiewBlockPropsType> = (props) => {
  return <PanelOverwiew {...props} />
}

import { PanelDevelopment } from '@/components/Blocks/PanelDevelopment/PanelDevelopment'

export interface PanelDevelopmentBlockPropsType {
  header: any
  categoriesList: {
    category: {
      title: string
      subcategoriesList: {
        icon: string
        title: string
        description: any
      }[]
    }
  }[]
}

export const PanelDevelopmentBlock: React.FC<PanelDevelopmentBlockPropsType> = (props) => {
  return <PanelDevelopment {...props} />
}

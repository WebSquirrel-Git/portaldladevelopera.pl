import { PanelNeed } from '@/components/Blocks/PanelNeed/PanelNeed'

export interface PanelNeedBlockPropsType {
  header: {
    normal: string
    gradient: string
  }
  description: {
    normal: string
    bold: string
  }
  button: {
    title: string
    url: string
  }
}

export const PanelNeedBlock: React.FC<PanelNeedBlockPropsType> = (props) => {
  return <PanelNeed {...props} />
}

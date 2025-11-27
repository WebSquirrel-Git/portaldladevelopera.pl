import { PanelAdvantages } from '@/components/Blocks/PanelAdvantages/PanelAdvantages';

export interface PanelAdvantagesBlockPropsType {
  header:{
    normal:string;
    gradient:string;
  }
  description:{
    normal:string;
    bold:string;
  }
  advantagesList:{
    icon:string;
    title:string;
     advantagesList:{
    advantage:string;
  }[]
  }[]
  
}

export const PanelAdvantagesBlock: React.FC<PanelAdvantagesBlockPropsType> = (props) => {
  return <PanelAdvantages {...props}/>
}

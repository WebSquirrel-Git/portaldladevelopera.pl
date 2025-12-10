import { Regulations } from '@/components/Blocks/Regulations/Regulations'

export interface RegulationsBlockPropsType {
  pageTitle: string
  headerSection: {
    headerH1: string
    headerRichText: any
  }
  content: {
    header: string
    text: any
    headerSize: 'h2' | 'h3'
  }[]
}

export const RegulationsBlock: React.FC<RegulationsBlockPropsType> = async (props) => {
  return <Regulations {...props} />
}

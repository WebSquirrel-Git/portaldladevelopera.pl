import { Regulations } from '@/components/Blocks/Regulations/Regulations'

export interface RegulationsBlockPropsType {
  headerSection: {
    headerSection: any
  }
  content: {
    header: string
    text: any
    headerSize: 'h2' | 'h3'
  }[]
}

export const RegulationsBlock: React.FC<RegulationsBlockPropsType> = (props) => {
  return <Regulations {...props} />
}

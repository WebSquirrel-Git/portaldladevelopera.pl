import { PrivacyPolicy } from '@/components/Blocks/PrivacyPolicy/PrivacyPolicy'

export interface PricingOverwiewBlockPropsType {
  pageTitle: string
  headerSection: {
    headerH1: string
    headerRichText: any
    navMenu: {
      navItem: string
    }[]
  }
  content: {
    header: string
    text: any
    navPoint: number
    headerSize: 'h2' | 'h3'
  }[]
}

export const PricingOverwiewBlock: React.FC<PricingOverwiewBlockPropsType> = (props) => {
  return <div>123</div>
}

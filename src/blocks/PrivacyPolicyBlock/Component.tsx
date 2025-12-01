import { PrivacyPolicy } from '@/components/Blocks/PrivacyPolicy/PrivacyPolicy'

export interface PrivacyPolicyBlockPropsType {
  headerSection: {
    headerSection: any
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

export const PrivacyPolicyBlock: React.FC<PrivacyPolicyBlockPropsType> = (props) => {
  return <PrivacyPolicy {...props} />
}

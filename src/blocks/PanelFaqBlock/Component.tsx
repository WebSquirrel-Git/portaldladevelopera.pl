import { PanelFaq } from '@/components/Blocks/PanelFaq/PanelFaq'
import { Faq, FolderInterface } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface PanelFaqBlockPropsType {
  header: string
  subheader: string
  questionsFolder: string
}

function isFaq(p: any): p is Faq {
  return p && typeof p === 'object' && 'id' in p
}

export const PanelFaqBlock: React.FC<PanelFaqBlockPropsType> = async (props) => {
  const { questionsFolder } = props
  const payload = await getPayload({ config: configPromise })
  const { docs: faq } = await payload.find({
    collection: 'faq',
    sort:'faqId',
    depth: 4,
    select: {
      title: true,
      description: true,
      folder:true
    },
    where: {
      folder: {
        
        equals: questionsFolder,
      },
    },
    limit: 9999,
  })
  const orderedFaqs: Faq[] = faq.filter(isFaq)
  return <PanelFaq header={props.header} subheader={props.subheader} questionsList={orderedFaqs} />
}

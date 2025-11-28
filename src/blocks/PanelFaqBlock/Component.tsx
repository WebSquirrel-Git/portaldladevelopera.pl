import { PanelFaq } from '@/components/Blocks/PanelFaq/PanelFaq'
import { Faq } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface PanelFaqBlockPropsType {
  header: string
  subheader: string
  questionsList: Faq[]
}

function isFaq(p: any): p is Faq {
  return p && typeof p === 'object' && 'id' in p
}

export const PanelFaqBlock: React.FC<PanelFaqBlockPropsType> = async (props) => {
  const payload = await getPayload({ config: configPromise })
  const faqsIds = props.questionsList.map((r) => (typeof r === 'string' ? r : r.id))
  const { docs: faq } = await payload.find({
    collection: 'faq',
    depth: 2,
    select: {
      title: true,
      description: true,
    },
    where: {
      id: {
        in: faqsIds,
      },
    },
  })
  const orderedFaqs: Faq[] = faqsIds.map((id) => faq.find((p) => p?.id === id)).filter(isFaq)
  return <PanelFaq header={props.header} subheader={props.subheader} questionsList={orderedFaqs} />
}

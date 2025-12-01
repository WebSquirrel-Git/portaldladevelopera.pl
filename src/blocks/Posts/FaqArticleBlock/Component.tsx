import { Faq } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostFaq } from '@/components/Posts/PostFaq/PostFaq'

export interface FaqArticleBlockPropsType {
  header: string
  navPoint: number
  questionsList: Faq[]
}

function isFaq(p: any): p is Faq {
  return p && typeof p === 'object' && 'id' in p
}

export const FaqArticleBlock: React.FC<FaqArticleBlockPropsType> = async (props) => {
  const { header, navPoint, questionsList } = props
  const payload = await getPayload({ config: configPromise })
  const faqsIds = questionsList.map((r) => (typeof r === 'string' ? r : r.id))
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
  return (
    <div
      id={`${navPoint}`}
      className="flex flex-col gap-[18px] xl:gap-[20px] px-3 xl:px-16 py-[18px] xl:py-[20px]"
    >
      <h2 className="text-white text-left">{header}</h2>
      <PostFaq questionsList={orderedFaqs} />
    </div>
  )
}

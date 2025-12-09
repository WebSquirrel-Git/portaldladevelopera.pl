'use server'
import { Faq, FolderInterface } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostFaq } from '@/components/Posts/PostFaq/PostFaq'

export interface FaqArticleBlockPropsType {
  questionsFolder: FolderInterface
}

function isFaq(p: any): p is Faq {
  return p && typeof p === 'object' && 'id' in p
}

export const FaqArticleBlock: React.FC<FaqArticleBlockPropsType> = async (props) => {
  const { questionsFolder } = props
  const payload = await getPayload({ config: configPromise })
  const { docs: faq } = await payload.find({
    collection: 'faq',
    depth: 2,
    select: {
      title: true,
      description: true,
    },
    where: {
      folder: {
        equals: questionsFolder.id,
      },
    },
  })
  const orderedFaqs: Faq[] = faq.filter(isFaq)
  return <PostFaq questionsList={orderedFaqs} />
}

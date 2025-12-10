import { Faq, FolderInterface, Media, Post, User } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getFaqsFromFolder } from '../HomePage/SchemaHomePage'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'

export interface ArticleSchemaProps {
  '@context': string
  '@graph': Array<{
    '@type': string
    url?: string
    name?: string
    logo?: string | { '@type': string; url: string }
    description?: string
    headline?: string
    image?: string | { '@type': string; url: string }
    author?: any
    publisher?: any
    datePublished?: string
    dateModified?: string
    mainEntityOfPage?: any
  }>
}

interface FaqBlock {
  type: 'block'
  fields: {
    blockType: string
    questionsFolder?: string | FolderInterface
  }
}

export const articleSchema = async (props: Post) => {
  const faqBlocks = props.richTextContent.root.children.filter(
    (item: any): item is FaqBlock =>
      item?.type === 'block' && item?.fields?.blockType === 'faqArticleBlock',
  )

  const faqItems: Faq[] = []
  for (const block of faqBlocks) {
    const fields = block.fields as FaqBlock['fields']
    const folder = fields.questionsFolder
    if (!folder) continue
    let folderObj: FolderInterface
    if (typeof folder === 'string') {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({
        collection: 'payload-folders',
        where: { id: { equals: folder } },
        limit: 1,
        depth: 0,
        pagination: false,
      })
      folderObj = docs[0] as FolderInterface
    } else {
      folderObj = folder
    }

    const faqsFromFolder = await getFaqsFromFolder(folderObj)
    faqItems.push(...faqsFromFolder)
  }
  const hasFaq = faqItems.length > 0

  const image = props.meta?.image as Media | undefined
  const author = props.authors as User[]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
        name: 'PanelDlaDewelopera.pl',
        logo: `${process.env.NEXT_PUBLIC_SERVER_URL}/logo.png`,
      },
      {
        '@type': 'WebPage',
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${props.slug}`,
        name: props.meta?.title || '',
        description: props.meta?.description || '',
      },
      {
        '@type': 'BlogPosting',
        headline: props.meta?.title || '',
        description: props.meta?.description || '',
        image: image?.url || `${process.env.NEXT_PUBLIC_SERVER_URL}/logo.png`,
        author: {
          '@type': 'Organization',
          name: 'RENDPRO LIMITED',
          url: `https://rend.pro/`,
          logo: `https://rend.pro/logo.png`,
          description:
            'REND.PRO - Marketing dewelopera i nieruchomości',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'contact@rend.pro',
            availableLanguage: ['pl'],
          },
          sameAs: [
            'https://www.facebook.com/Rendprocom',
            'https://www.instagram.com/rendprocom/',
            'https://www.linkedin.com/company/rendpro/',
            'https://www.youtube.com/channel/UCn9fS3ObuUVEXbPW3urE8Ug',
          ],
          brand: {
            '@type': 'Brand',
            name: 'PanelDlaDewelopera.pl',
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
            logo: `${process.env.NEXT_PUBLIC_SERVER_URL}/logo.png`,
            sameAs: [
              'https://www.facebook.com/paneldladewelopera/',
              'https://www.instagram.com/paneldladewelopera',
              'https://www.youtube.com/@paneldladewelopera',
            ],
          },
        },
        publisher: {
          '@type': 'Person',
          name: author[0].articleName ? author[0].articleName : 'Aleksander Gadomski',
          sameAs: [
            author?.[0]?.instagram || 'https://instagram.com/default',
            author?.[0]?.facebook || 'https://facebook.com/default',
            author?.[0]?.linkedin || 'https://youtube.com/default',
            author?.[0]?.website || `${process.env.NEXT_PUBLIC_SERVER_URL}`,
          ].filter(Boolean),
        },
        datePublished: props.publishedAt || '',
        dateModified: props.updatedAt || '',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${props.slug}`,
        },
      },
      ...(hasFaq
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.title,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: lexicalToPlainText(item.description),
                },
              })),
            },
          ]
        : []),
    ],
  }

  //     {
  //         '@context':'https://schema.org',
  //         '@type':'Article',
  //         headline:props.title,
  //         datePublished: new Date(props.createdAt),
  //         dateModified:new Date(props.updatedAt),
  //         image:image?image.url:'',
  //         author:{
  //  type:'Person',
  //             name:author[0].articleName?author[0].articleName:'Aleksander Gadomski'
  //         }

  //     }
}

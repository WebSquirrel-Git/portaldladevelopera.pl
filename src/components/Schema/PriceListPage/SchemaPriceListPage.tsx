import type { Faq, FolderInterface, Media, Page, Post, PriceList, User } from '@/payload-types'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getFaqsFromFolder(folder: FolderInterface): Promise<Faq[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs: faqs } = await payload.find({
    collection: 'faq',
    depth: 2,
    select: {
      title: true,
      description: true,
    },
    where: {
      folder: {
        equals: folder.id,
      },
    },
  })
  return faqs.filter((f): f is Faq => !!f?.id)
}

export interface SchemaPriceListPageProps {
  '@context': string
  '@graph': (
    | {
        '@type': string
        url: string
        name: string
        logo: string
        description: string
        contactPoint?: undefined
        sameAs?: undefined
        brand?: undefined
        itemListElement?: undefined
        mainEntity?: undefined
      }
    | {
        '@type': string
        url: string
        name: string
        description: string
        logo?: undefined
        contactPoint?: undefined
        sameAs?: undefined
        brand?: undefined
        itemListElement?: undefined
        mainEntity?: undefined
      }
    | {
        '@type': string
        name: string
        url: string
        logo: string
        description: string
        contactPoint: {
          '@type': string
          contactType: string
          email: string
          availableLanguage: string[]
        }
        sameAs: string[]
        brand: any
        itemListElement?: undefined
        mainEntity?: undefined
      }
    | any
    | any
  )[]
}

export const priceListPageSchema = async (props: Page) => {
  const faqBlocks = props.layout.filter((item) => item.blockType === 'panelFaqBlock')
  const faqItems: Faq[] = []
  for (const block of faqBlocks) {
    const folder = block.questionsFolder
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
const pricingOverviewBlock = props.layout.filter((item)=>item.blockType==='pricingOverwiewBlock'
)
const pricingPlans = pricingOverviewBlock[0].cards.map((item:any)=>{
  return ({
        "@type": "Offer",
        "name": item.title,
        "price": item.monthPricing.monthMonthPrice,
        "priceCurrency": "PLN",
        "url": `${process.env.NEXT_PUBLIC_SERVER_URL}/cennik`,
        "category": "subscription",
        "eligibleDuration": {
          "@type": "QuantitativeValue",
          "value": 1,
          "unitText": "MONTH"
        }
      })
})
  const hasFaq = faqItems.length > 0
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
        name: 'PanelDlaDewelopera.pl',
        logo: `${process.env.NEXT_PUBLIC_SERVER_URL}/logo.png`,
        description:
          'Nowoczesna aplikacja do integracji deweloperów z systemem Ministerstwa Cyfryzacji. Automatyczne publikowanie cen, historii i więcej.',
      },
      {
        '@type': 'WebPage',
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${props.slug}`,
        name: `${props.meta?.title}`,
        description: `${props.meta?.description}`,
      },
      {
        '@type': 'Organization',
        name: 'RENDPRO LIMITED',
        url: `https://rend.pro/`,
        logo: `https://rend.pro/logo.png`,
        description:
          'REND.PRO - Marketing dewelopera i nieruchomości.',
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
      {
    "@type": "OfferCatalog",
    "name": "Cennik – plany subskrypcyjne",
    "itemListElement":pricingPlans
  
},
       {
        '@type': 'ItemList',
        name: 'Główne menu nawigacyjne',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Home',
            url: 'https://paneldladewelopera.pl/home',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Cennik',
            url: 'https://paneldladewelopera.pl/cennik',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'Blog',
            url: 'https://paneldladewelopera.pl/blog',
          },
        ],
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
}

import type { Block } from 'payload'

export const FaqArticleBlock: Block = {
  slug: 'faqArticleBlock',
  interfaceName: 'FaqArticleBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  fields: [
    {
      name: 'questionsList',
      label: 'Lista pytań',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      required: true,
    },
  ],
}

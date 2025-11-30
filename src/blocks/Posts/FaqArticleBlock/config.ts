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
      name: 'header',
      label: 'Nagłówek',
      type: 'text',
      required: true,
    },
    {
      name: 'navPoint',
      label: 'Punkt ze spisu treści',
      type: 'number',
      required: true,
    },
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

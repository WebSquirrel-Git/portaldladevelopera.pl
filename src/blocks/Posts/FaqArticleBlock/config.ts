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
      name: 'questionsFolder',
      label: 'Folder z pytaniami',
      type: 'relationship',
      relationTo: 'payload-folders',

      hasMany: false,
      required: true,
    },
  ],
}

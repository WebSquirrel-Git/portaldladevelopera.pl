import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TextArticleBlock: Block = {
  slug: 'textArticleBlock',
  interfaceName: 'TextArticleBlock',
  labels: {
    singular: 'Tekst',
    plural: 'Teksty',
  },
  fields: [
    {
      name: 'header',
      label: 'Nagłówek',
      type: 'text',
      required: true,
    },
    {
      name: 'headerSize',
      label: 'Typ nagłówka',
      type: 'select',
      required: true,
      options:[
        {
          value:'h2',
          label:'H2'
        },
         {
          value:'h3',
          label:'H3'
        },
      ]
    },
    {
      name: 'navPoint',
      label: 'Punkt ze spisu treści',
      type: 'number',
      required: true,
    },
    {
              name: 'text',
              label: 'Tekst',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures,defaultFeatures }) => {
                  return [
                    ...rootFeatures,...defaultFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
  ],
}

import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PricingOverwiewBlock: Block = {
  slug: 'pricingOverwiewBlock',
  interfaceName: 'PricingOverwiewBlock',
  labels: {
    singular: 'Prezentacja Cennika',
    plural: 'Prezentacja Cennika',
  },
  fields: [
     {
         name: 'Header',
         label: 'Sekcja nagłówka',
         type: 'richText',
         required: true,
         editor: lexicalEditor({
           features: ({ rootFeatures, defaultFeatures }) => {
             return [
               ...rootFeatures,
               ...defaultFeatures,
               HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
               FixedToolbarFeature(),
               InlineToolbarFeature(),
             ]
           },
         }),
       },
    {
      name: 'subheader',
      label: 'Podnagłówek',
      type: 'text',
      required: true,
    },
    {
      name: 'cards',
      label: 'Karty z pakietami',
      type: 'relationship',
      relationTo: 'priceList',
      hasMany: true,
      
      required: true,
    },
  ],
}

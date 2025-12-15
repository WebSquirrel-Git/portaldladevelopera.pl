import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PricingTableBlock: Block = {
  slug: 'pricingTableBlock',
  interfaceName: 'PricingTableBlock',
  labels: {
    singular: 'Cennik - Sekcja Tabela',
    plural: 'Cennik - Sekcja Tabela',
  },
  fields: [
     {
         name: 'infoCard1',
         label: 'Karta informacyjna przed tabelą',
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
      name: 'table',
      label: 'Tabela',
      type: 'relationship',
      relationTo: 'priceList',
      hasMany: true,
      required: true,
    },
    {
       name: 'infoCard2',
         label: 'Karta informacyjna po tabeli',
         type:'group',
         required:true,
         fields:[
{
         name: 'list',
         label: 'Nagłówkek z listą',
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
         name: 'card',
         label: 'Karta z listą',
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
         ]
    }
    
  ],
}

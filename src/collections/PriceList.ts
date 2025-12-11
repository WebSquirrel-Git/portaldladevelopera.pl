import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PriceList: CollectionConfig = {
  slug: 'priceList',
  admin: {
    useAsTitle: 'title',
  },
  labels: {
    singular: 'Cennik',
    plural: 'Cennik',
  },
  folders: false,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    
    {
      name:'orientation',
      label:'Orientacja',
      type:'select',
      required:true,
      options:[
        {
          label:'Pionowa',
          value:'vertical'
        },
         {
          label:'Pozioma',
          value:'horizontal'
        }
      ]
    },
    {
  name: 'featured',
  type: 'checkbox',
  label: 'Wyróżniona',
  admin: {
    condition: (data) => data?.orientation === 'vertical',
  },
},
    {
      name: 'title',
      label: 'Nazwa pakietu',
      type: 'text',
      required: true,
    },
       {
         name: 'subheader',
         label: 'Podnagłówek',
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
  name: 'featuredTag',
  type: 'text',
  label: 'Tekst etykiety',
  admin: {
    condition: (data) => data?.featured===true,
  },
},
{
  type: 'row',
  fields: [
   {
  name:'monthPricing',
  type:'group',
  required:true,
  label: 'Ceny - abonament miesięczny',
  fields:[
    {
      name:'monthMonthPrice',
      label:'Cena za MIESIĄC',
      type:'number',
      required:true
    },
    {
      name:'monthYearPrice',
      label:'Cena za ROK',
      type:'number',
      required:true
    },
  ] 
},
{
  name:'yearPricing',
  type:'group',
  required:true,
  label: 'Ceny - abonament roczny',
  fields:[
   {
      name:'yearMonthPrice',
      label:'Cena za MIESIĄC',
      type:'number',
      required:true
    },
 {
  name: 'yearYearPriceBlock',
  type: 'group',
  label: 'Cena za ROK',
  required:true,
  fields:[
    {
      name:'yearPrice',
      label:'Cena',
      type:'number',
      required:true
    },
    {
      name:'yearPricePromo',
      label:'Promocja? (Jeśli brak zostaw puste)',
      type:'text',
    }
  ] 
}
  ] 
}
  ] 
},
{
  type: 'tabs',
  tabs: [
   {
     admin: {
    condition: (data) => data?.orientation==='vertical',
  },
  label: 'Limit',
  fields:[
     {
          name:'limitsHeader',
      label:'Nagłówek',
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
      name:'limitsList',
      label:'Lista limitów',
      type:'array',
      required:true,
      labels:{
        singular:'Ograniczenie',
        plural:'Ograniczenia'
      },
      fields:[
        {
          name:'limit',
          label:'Treść',
          type:'text',
          required:true
        }
      ]
    },
  ] 
},
{
  label: 'Co zawiera',
  fields:[
     {
          name:'includesHeader',
      label:'Nagłówek',
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
      name:'includesList',
      label:'Lista co zawiera pakiet?',
      type:'array',
      required:true,
      labels:{
        singular:'Punkt listy',
        plural:'Punkty listy'
      },
      fields:[
        {
          name:'includes',
          label:'Treść',
          type:'text',
          required:true
        }
      ]
    },
  ] 
},
{
     admin: {
    condition: (data) => data?.orientation==='vertical',
  },
  label: 'Nie zawiera',
  fields:[
    
    {
      name:'notContainList',
      label:'Lista czego nie zawiera pakiet',
      type:'array',
      labels:{
        singular:'Pakiet nie zawiera',
        plural:'Pakiet nie zawiera'
      },
      fields:[
        {
          name:'notContain',
          label:'Treść',
          type:'text',
        }
      ]
    },
  ] 
},
  ] 
}
  ],
}

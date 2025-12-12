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
   admin: {
    condition: (data) => data?.orientation === 'vertical',
  },
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
  name:'button',
  label:'Przycisk',
  type:'group',
  required:true,
  fields:[
{
  name:'label',
  type:'text',
  label:'Etykieta',
  required:true
},
{
  name:'url',
  type:'text',
  label:'Adres url',
  required:true
},
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
          name:'limits',
      label:'Lista limitów',
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
},
{
  label: 'Co zawiera',
  fields:[
    {
          name:'includes',
      label:'List z nagłówkiem',
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
},
{
     admin: {
    condition: (data) => data?.orientation==='vertical',
  },
  label: 'Nie zawiera',
  fields:[
    {
          name:'notContains',
      label:'Lista z nagłówkiem',
         type: 'richText',
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
},
  ] 
},
{
  name:'table',
  label:'Dane do tabeli',
  type:'group',
  required:true,
  fields:[
    {
      name:'position1',
      label:'Firmy deweloperskie',
      type:'text',
      required:true
    },
    {
      name:'position2',
      label:'Inwestycje',
      type:'text',
      required:true
    },
    {
      name:'position3',
      label:'Lokale',
      type:'text',
      required:true
    },
    {
      name:'position4',
      label:'Użytkownicy',
      type:'text',
      required:true
    },
     {
      name:'position5',
      label:'Generowanie XML + MD5 zgodne z UOKiK',
      type:'checkbox',
    },
     {
      name:'position6',
      label:'Eksport do dane.gov.pl',
      type:'checkbox',
    },
     {
      name:'position7',
      label:'Historia zmian cen i statusów',
      type:'checkbox',
    },
     {
      name:'position8',
      label:'Chatbot-AI (pomoc w obsłudze panelu)',
      type:'checkbox',
    },
     {
      name:'position9',
      label:'AI-asystent danych (opisy, automatyzacja)',
      type:'checkbox',
    },
     {
      name:'position10',
      label:'Analiza AI rynku (ceny m², trendy)',
      type:'checkbox',
    },
     {
      name:'position11',
      label:'Biblioteka',
      type:'text',
      required:true
    },
     {
      name:'position12',
      label:'Linki / foldery do dysku Google',
      type:'text',
      required:true
    },
      {
      name:'position13',
      label:'Integracja ze stroną (API / iframe)',
      type:'checkbox',
    },
     {
      name:'position14',
      label:'Integracje API (CRM, ERP, CMS)',
      type:'group',
      fields:[
         {
      name:'contains',
      label:'Zawiera?',
      type:'checkbox',
    },
     {
      name:'info',
      label:'Informacja dodatkowa',
      type:'text',
    },
      ]
    },
     {
      name:'position15',
      label:'Priorytet wdrażania zmian przepisów',
      type:'select',
      options:[
        {
          value:'higherPlans',
          label:'Dostępne w wyższych planach'
        },
        {
          value:'contains',
          label:'Zawiera'
        },
      ]
    },
    {
      name:'position16',
      label:'Priorytetowe wsparcie',
      type:'text',
      required:true
    },
      {
      name:'position17',
      label:'Dostęp do roadmapy + wpływ na rozwój',
      type:'checkbox',
    },
  ]
}
  ],
}

import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Stopka',
  access: {
    read: () => true,
  },
  fields: [
    {
                      name: 'title',
                      label: 'Nagłówek',
                      type: 'richText',
                      required: true,
                      editor: lexicalEditor({
                        features: ({ rootFeatures }) => {
                          return [
                            ...rootFeatures,
                            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                          ]
                        },
                      }),
                    },
    {
      name: 'companyNavItems',
      label: 'Menu nawigacyjne',
      labels: {
        singular: 'Link',
        plural: 'Linki',
      },
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'regulationsNavItems',
      label: 'Menu nawigacyjne informacje (Regulamin itp.)',
      labels: {
        singular: 'Link',
        plural: 'Linki',
      },
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name:'companyInformations',
      label:'Informacje o Firmie',
      required:true,
      type:'group',
      fields:[
        {
          name:'email',
          label:'E-mail',
          type:'text',
          required:true
        },
        {
          name:'website',
          label:'Link do strony',
          type:'group',
          required:true,
          fields:[
           {
          name:'label',
          label:'Etykieta',
          type:'text',
          required:true
        },
        {
          name:'url',
          label:'Url',
          type:'text',
          required:true
        }, 
          ]
        },
        {
          name:'facebook',
          label:'Facebook',
          type:'group',
          fields:[
           {
          name:'ikona',
          label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
          type:'text',
        },
        {
          name:'url',
          label:'Url',
          type:'text',
        }, 
          ]
        },
         {
          name:'instagram',
          label:'Instagram',
          type:'group',
          fields:[
           {
          name:'ikona',
          label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
          type:'text',
        },
        {
          name:'url',
          label:'Url',
          type:'text',
        }, 
          ]
        },
         {
          name:'youtube',
          label:'YouTube',
          type:'group',
          fields:[
           {
          name:'ikona',
          label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
          type:'text',
        },
        {
          name:'url',
          label:'Url',
          type:'text',
        }, 
          ]
        },
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

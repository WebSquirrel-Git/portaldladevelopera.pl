import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TableArticleBlock: Block = {
  slug: 'tableArticleBlock',
  interfaceName: 'TableArticleBlock',
  labels: {
    singular: 'Tabela',
    plural: 'Tabele',
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
      name: 'table',
      label: 'Tabela',
      type: 'array',
      maxRows:3,
      labels:{
        singular:'Kolumna tabeli',
        plural:'Kolumny tabeli'
      },
      required: true,
      fields:[
        {
          name: 'header',
      label: 'Nagłówek',
      type: 'text',
      required: true,
        },
          {
      name: 'rows',
      label: 'Wiersze',
      type: 'array',
      labels:{
        singular:'Wiersz tabeli',
        plural:'Wiersze tabeli'
      },
      required: true,
      fields:[
        {
          name: 'row',
      label: 'Wiersz',
      type: 'text',
      required: true,
        },
         
      ]
    },
      ]
    },
  ],
}

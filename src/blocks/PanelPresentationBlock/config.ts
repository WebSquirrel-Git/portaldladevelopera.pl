import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const PanelPresentationBlock: Block = {
  slug: 'panelPresentationBlock',
  interfaceName: 'PanelPresentationBlock',
  labels: {
    singular: 'Panel - Jak to działa?',
    plural: 'Panel - Jak to działa?',
  },
  fields: [
     {
          name: 'header',
      label: 'Nagłówek',
          type: 'text',
          required: true,
        },
    {
      name:'slidesArray',
      label:'Slajdy',
      type:'array',
      labels:{
        singular:'Slajd - Lista',
        plural:'Slajdy - Lista'
      },
      fields:[
{
      name: 'slide',
      label: 'Slajd',
      type: 'group',
      required: true,
      fields:[
        {
           name: 'header',
      label: 'Nagłówek',
           type: 'richText',
         required:true,
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
      // name: 'header',
      // label: 'Nagłówek',
      // type: 'group',
      // required: true,
      // fields:[
      //   {
      //     name: 'gradient',
      //     label: 'Tekst - gradientowy kolor',
      //     type: 'text',
      //     required: true,
      //   },
      //    {
      //     name: 'normal',
      //     label: 'Tekst - normalny kolor',
      //     type: 'text',
      //     required: true,
      //   },
        
      // ]
    },
    {
      name:'slideList',
      label:'Lista opisowa',
      labels:{
        singular:'Element listy opisowej',
        plural:'Elementy listy opisowej'
      },
      type:'array',
      required:true,
      fields:[
{
          name: 'slideListDescription',
          label: 'Opis',
         type: 'richText',
         required:true,
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
      ]
    },
    {
      name:'image',
      label:'Zdjęcie',
      type:'upload',
      relationTo:'media',
      required:true
    }
      ]
    },
      ]
    }
  ],
}

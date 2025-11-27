import type { Block } from 'payload'

export const PanelAdvantagesBlock: Block = {
  slug: 'panelAdvantagesBlock',
  interfaceName: 'PanelAdvantagesBlock',
  labels: {
    singular: 'Zalety Panelu',
    plural: 'Zalety Panelu',
  },
  fields: [
     {
      name: 'header',
      label: 'Nagłówek',
      type: 'group',
      required: true,
      fields:[
         {
          name: 'normal',
          label: 'Tekst - normalny kolor',
          type: 'text',
          required: true,
        },
        {
          name: 'gradient',
          label: 'Tekst - gradientowy kolor',
          type: 'text',
          required: true,
        },
      ]
    },
     {
      name: 'description',
      label: 'Opis',
      type: 'group',
      required: true,
      fields:[
         {
          name: 'bold',
          label: 'Tekst - pogrubiony',
          type: 'text',
          required: true,
        },
         {
          name: 'normal',
          label: 'Tekst - normalny',
          type: 'text',
          required: true,
        },
       
      ]
    },
   {
      name: 'advantagesList',
      label: 'Lista Zalet',
      labels:{
        singular:'Zaleta',
        plural:'Zalety'
      },
      type: 'array',
      required: true,
      fields: [
        {
          name: 'icon',
          label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          label: 'Tytuł',
          type: 'text',
          required: true,
        },
        {
           name: 'advantagesList',
          label: 'Lista zalet',
          type: 'array',
           labels:{
        singular:'Zaleta',
        plural:'Zalety'
      },
          required: true,
          fields:[
             {
          name: 'advantage',
          label: 'Zaleta',
          type: 'text',
          required: true,
        },
          ]
        }
      ],
    },
    
  ],
}

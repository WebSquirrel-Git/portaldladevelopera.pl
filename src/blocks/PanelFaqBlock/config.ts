import type { Block } from 'payload'

export const PanelFaqBlock: Block = {
  slug: 'panelFaqBlock',
  interfaceName: 'PanelFaqBlock',
  labels: {
    singular: 'FAQ - Strona Główna',
    plural: 'FAQ - Strona Główna',
  },
  fields: [
    {
      name: 'header',
      label: 'Nagłówek',
      type: 'text',
      required: true,
    },
    {
      name: 'subheader',
      label: 'Podnagłówek',
      type: 'text',
      required: true,
    },
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

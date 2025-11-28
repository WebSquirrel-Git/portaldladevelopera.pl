import type { Block } from 'payload'

export const PanelNeedBlock: Block = {
  slug: 'panelNeedBlock',
  interfaceName: 'PanelNeedBlock',
  labels: {
    singular: 'Czy potrzebny mi panel?',
    plural: 'Czy potrzebny mi panel?',
  },
  fields: [
    {
      name: 'header',
      label: 'Nagłówek',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'gradient',
          label: 'Tekst - gradientowy kolor',
          type: 'text',
          required: true,
        },
        {
          name: 'normal',
          label: 'Tekst - normalny kolor',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      label: 'Opis',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'normal',
          label: 'Tekst - normalny',
          type: 'text',
          required: true,
        },
        {
          name: 'bold',
          label: 'Tekst - pogrubiony',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'button',
      label: 'Przycisk',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'title',
          label: 'Tytuł',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'Adres Url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

import type { Block } from 'payload'

export const PanelOverwiewBlock: Block = {
  slug: 'panelOverwiewBlock',
  interfaceName: 'PanelOverwiewBlock',
  labels: {
    singular: 'Prezentacja Panelu',
    plural: 'Prezentacja Panelu',
  },
  fields: [
    {
      name: 'tagsList',
      label: 'Lista Tagów',
      labels: {
        singular: 'Tag',
        plural: 'Tagi',
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
      ],
    },
    {
      name: 'description',
      label: 'Opis',
      type: 'text',
      required: true,
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
    {
      name: 'testimonialsList',
      label: 'Lista Opinii',
      type: 'array',
      labels: {
        singular: 'Opinia',
        plural: 'Opinie',
      },
      required: true,
      fields: [
        {
          name: 'stars',
          label: 'Ilość gwiazdek',
          type: 'number',
          max: 5,
          min: 1,
          required: true,
        },
        {
          name: 'testimonial',
          label: 'Opinia',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

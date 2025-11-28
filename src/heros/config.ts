import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'mainHero',
      label: 'Rodzaj Hero',
      options: [
        {
          label: 'Brak',
          value: 'none',
        },
        {
          label: 'Strona Główna Hero',
          value: 'mainHero',
        },
      ],
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Zdjęcie w tle',
      admin: {
        condition: (_, { type } = {}) => ['mainHero'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'card',
      label: 'Karta',
      type: 'group',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['mainHero'].includes(type),
      },
      fields: [
        {
          name: 'header',
          label: 'Nagłówek',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
        {
          name: 'ctaButton',
          label: 'Przycisk CTA',
          type: 'group',
          required: true,
          fields: [
            {
              name: 'label',
              label: 'Opis',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'Adres url',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

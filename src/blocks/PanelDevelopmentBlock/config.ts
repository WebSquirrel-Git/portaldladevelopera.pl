import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const PanelDevelopmentBlock: Block = {
  slug: 'panelDevelopmentBlock',
  interfaceName: 'PanelDevelopmentBlock',
  labels: {
    singular: 'Rozwój panelu',
    plural: 'Rozwój panelu',
  },
  fields: [
    {
      name: 'header',
      label: 'Nagłówek (tekst z gradientem - pogrubiony tekst)',
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
      name: 'categoriesList',
      label: 'Lista Kategorii',
      labels: {
        singular: 'Kategoria',
        plural: 'Kategorie',
      },
      type: 'array',
      required: true,
      fields: [
        {
          name: 'category',
          label: 'Kategoria',
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
              name: 'subcategoriesList',
              label: 'Lista Podkategorii',
              type: 'array',
              labels: {
                singular: 'Podkategoria',
                plural: 'Podkategorie',
              },
              required: true,
              fields: [
                {
                  name: 'icon',
                  label:
                    'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
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
                  name: 'description',
                  label: 'Opis',
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
              ],
            },
          ],
        },
      ],
    },
  ],
}

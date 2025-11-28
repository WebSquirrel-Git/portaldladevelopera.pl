import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const PanelPhonesGalleryBlock: Block = {
  slug: 'panelPhonesGalleryBlock',
  interfaceName: 'PanelPhonesGalleryBlock',
  labels: {
    singular: 'Galeria z telefonami',
    plural: 'Galeria z telefonami',
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
      name: 'galleryArray',
      label: 'Galeria',
      type: 'array',
      labels: {
        singular: 'Galeria - Lista',
        plural: 'Galerie - Lista',
      },
      fields: [
        {
          name: 'image',
          label: 'Zdjęcie',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'group',
          required: true,
          fields: [
            {
              name: 'icon',
              label: 'Ikona - wejdź na stronę https://icon-sets.iconify.design/ i wklej kod ikony.',
              type: 'text',
              required: true,
            },
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
              name: 'description',
              label: 'Opis',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

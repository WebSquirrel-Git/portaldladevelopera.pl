import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Faq: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'title',
  },
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
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
        features: ({ rootFeatures, defaultFeatures }) => {
          return [
            ...rootFeatures,
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
  ],
}

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const PrivacyPolicyBlock: Block = {
  slug: 'privacyPolicyBlock',
  interfaceName: 'PrivacyPolicyBlock',
  labels: {
    singular: 'Polityka Prywatności',
    plural: 'Polityka Prywatności',
  },
  fields: [
    {
      name: 'headerSection',
      label: 'Sekcja nagłówka',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'headerSection',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures, defaultFeatures }) => {
              return [
                ...rootFeatures,
                ...defaultFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                HorizontalRuleFeature(),
              ]
            },
          }),
          label: 'Treść nagłówka z opisem',
          required: true,
        },
        {
          name: 'navMenu',
          label: 'Spis treści',
          type: 'array',
          labels: {
            singular: 'Punkt spisu treści',
            plural: 'Punkty spisu treści',
          },
          required: true,
          fields: [
            {
              name: 'navItem',
              label: 'Punkt spisu treści',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      label: 'Treść - lista',
      labels: {
        singular: 'Punkt listy',
        plural: 'Punkty listy',
      },
      required: true,
      type: 'array',
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
          options: [
            {
              value: 'h2',
              label: 'H2',
            },
            {
              value: 'h3',
              label: 'H3',
            },
          ],
        },
        {
          name: 'navPoint',
          label: 'Punkt ze spisu treści',
          type: 'number',
          required: true,
        },
        {
          name: 'text',
          label: 'Tekst',
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
    },
  ],
}

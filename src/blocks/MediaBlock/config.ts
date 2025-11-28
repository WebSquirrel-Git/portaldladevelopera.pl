import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Zdjęcie',
    plural: 'Zdjęcia',
  },
  fields: [
    {
      name: 'media',
      label: 'Zdjęcie',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

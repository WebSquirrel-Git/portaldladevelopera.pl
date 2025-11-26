import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Tytuł',
      },
      {
        type: 'text',
        name: 'description',
        label: 'Opis',
      },
      {
        name: 'image',
        label: 'Zjęcie',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
]

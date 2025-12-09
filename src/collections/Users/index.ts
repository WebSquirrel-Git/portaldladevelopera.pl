import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Użytkownik',
    plural: 'Użytkownicy',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nazwa użytkownika',
    },
    {
      name: 'articleName',
      type: 'text',
      label: 'Blog - nazwa użytkownika',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Strona www',
    },
  ],
  timestamps: true,
}

import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactFormBlock',
  interfaceName: 'ContactFormBlock',
  labels: {
    singular: 'Formularz kontaktowy',
    plural: 'Formularz kontaktowy',
  },
  fields: [
   {
    name:'submitOnEmail',
    label:'Email na który wysyłane będą formularze',
    type:'text',
required:true
   }
  ],
}

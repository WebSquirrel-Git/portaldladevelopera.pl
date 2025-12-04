import ContactForm from '@/components/Blocks/ContactForm/ContactForm';

export interface ContactFormBlockPropsType {
  submitOnEmail:string;
}

export const ContactFormBlock: React.FC<ContactFormBlockPropsType> = (props) => {
  return <ContactForm {...props} />
}

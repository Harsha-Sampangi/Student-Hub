import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Student Hub — partnerships, feedback, or general inquiries. We\'d love to hear from you.',
};

export default function ContactPage() {
  return <ContactContent />;
}

import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Student Hub — our mission, journey, core values, and vision to empower every student across India.',
};

export default function AboutPage() {
  return <AboutContent />;
}

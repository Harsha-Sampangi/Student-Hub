import { Metadata } from 'next';
import EventsContent from './EventsContent';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Workshops, bootcamps, and community events hosted by Student Hub. Join us to learn, build, and grow together.',
};

export default function EventsPage() {
  return <EventsContent />;
}

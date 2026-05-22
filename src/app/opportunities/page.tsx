import { Metadata } from 'next';
import OpportunitiesContent from './OpportunitiesContent';

export const metadata: Metadata = {
  title: 'Opportunities',
  description:
    'Discover hackathons, internships, workshops, scholarships, coding contests, and more opportunities curated for Indian students.',
};

export default function OpportunitiesPage() {
  return <OpportunitiesContent />;
}

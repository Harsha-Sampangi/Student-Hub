import { Metadata } from 'next';
import ResourcesContent from './ResourcesContent';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Free roadmaps, PDFs, learning materials, GitHub repos, career prep guides, and developer tools curated by Student Hub.',
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}

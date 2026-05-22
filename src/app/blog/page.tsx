import { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights, guides, and tips from the Student Hub community on careers, tech, open source, and student life.',
};

export default function BlogPage() {
  return <BlogContent />;
}

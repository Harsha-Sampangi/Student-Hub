import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockBlogs } from '@/data/mock';
import BlogPostContent from './BlogPostContent';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockBlogs
    .filter((b) => b.isPublished)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = mockBlogs.find((b) => b.slug === slug && b.isPublished);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = mockBlogs.find((b) => b.slug === slug && b.isPublished) || null;

  const relatedPosts = post
    ? mockBlogs.filter((b) => b.isPublished && b.id !== post.id).slice(0, 2)
    : mockBlogs.filter((b) => b.isPublished).slice(0, 2);

  return (
    <BlogPostContent
      slug={slug}
      initialPost={post}
      initialRelatedPosts={relatedPosts}
    />
  );
}

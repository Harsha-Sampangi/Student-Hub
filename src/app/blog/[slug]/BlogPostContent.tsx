'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { fetchCollection, fetchDocument } from '@/lib/firestore';
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

interface BlogPostContentProps {
  slug: string;
  initialPost: BlogPost | null;
  initialRelatedPosts: BlogPost[];
}

const gradientPalette = [
  'from-brand-teal to-brand-blue',
  'from-brand-blue to-indigo-500',
  'from-brand-amber to-orange-500',
];

const categoryColorMap: Record<string, string> = {
  Career: 'bg-brand-teal/10 text-brand-teal',
  Opportunities: 'bg-brand-blue/10 text-brand-blue',
  Development: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Community: 'bg-brand-amber/10 text-brand-amber-dark',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function BlogPostContent({
  slug,
  initialPost,
  initialRelatedPosts,
}: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(initialRelatedPosts);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    if (initialPost) {
      setLoading(false);
      return;
    }

    const loadPostData = async () => {
      setLoading(true);
      try {
        const found = await fetchDocument<BlogPost>('blogs', slug);
        if (found && found.isPublished) {
          setPost(found);
          const allBlogs = await fetchCollection<BlogPost>('blogs');
          const related = allBlogs
            .filter((b) => b.isPublished && b.id !== found.id)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (e) {
        console.error('Failed to load post:', e);
      } finally {
        setLoading(false);
      }
    };
    loadPostData();
  }, [slug, initialPost]);

  if (loading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading article...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
            Article Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            The article you are looking for does not exist, or has been unpublished.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold rounded-xl transition-all duration-300"
          >
            <HiOutlineArrowLeft className="w-5.5 h-5.5" />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen pt-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-tertiary hover:text-brand-teal transition-colors duration-300"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          {/* Category */}
          <motion.div variants={fadeInUp}>
            <span
              className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold mb-4 ${
                categoryColorMap[post.category] ??
                'bg-surface-container text-text-secondary'
              }`}
            >
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Meta Row */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-6 text-sm text-text-tertiary mb-8"
          >
            <div className="flex items-center gap-2">
              {/* Author Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white font-bold text-sm">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-text-primary">{post.author}</div>
                <div className="text-text-tertiary text-xs">Author</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineCalendarDays className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineClock className="w-4 h-4" />
              {post.readingTime} min read
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-surface-container text-text-secondary text-xs font-medium border border-border"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-brand-teal prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-li:text-text-secondary mb-16"
        >
          {post.content.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={i} className="font-display text-2xl font-bold text-text-primary mt-10 mb-4">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed === '') {
              return <br key={i} />;
            }
            return (
              <p key={i} className="text-text-secondary leading-relaxed mb-4">
                {trimmed}
              </p>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-border mb-16" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8"
            >
              Related Posts
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related, index) => {
                const gradient =
                  gradientPalette[(index + 1) % gradientPalette.length];
                return (
                  <motion.div key={related.id} variants={fadeInUp}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="block group h-full"
                      aria-label={`Read ${related.title}`}
                    >
                      <article className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
                        <div
                          className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-3 left-3 w-12 h-12 border-2 border-white/30 rounded-xl rotate-12" />
                            <div className="absolute bottom-3 right-3 w-8 h-8 border-2 border-white/20 rounded-full" />
                          </div>
                          <div className="relative z-10 text-white text-2xl">📄</div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-base font-bold text-text-primary mb-2 leading-snug group-hover:text-brand-teal transition-colors duration-300">
                            {related.title}
                          </h3>
                          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                            {related.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-text-tertiary">
                            <span className="flex items-center gap-1">
                              <HiOutlineUser className="w-3.5 h-3.5" />
                              {related.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <HiOutlineClock className="w-3.5 h-3.5" />
                              {related.readingTime} min
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </article>
    </main>
  );
}

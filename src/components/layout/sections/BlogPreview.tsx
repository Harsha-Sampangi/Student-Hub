'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchCollection } from '@/lib/firestore';
import type { BlogPost } from '@/types';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const gradients = [
  'from-brand-teal via-brand-blue to-brand-teal-dark',
  'from-brand-amber via-brand-teal to-brand-blue',
  'from-purple-500 via-brand-blue to-brand-teal',
];

const categoryColors: Record<string, string> = {
  Career: 'bg-brand-teal/10 text-brand-teal',
  Opportunities: 'bg-brand-blue/10 text-brand-blue',
  Development: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Tutorial: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Community: 'bg-brand-amber/10 text-brand-amber-dark dark:text-brand-amber',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchCollection<BlogPost>('blogs');
        setBlogs(data.filter((b) => b.isPublished).slice(0, 3));
      } catch (e) {
        console.error('Failed to load blogs preview:', e);
      }
    };
    loadBlogs();
  }, []);

  return (
    <section
      className="py-24 sm:py-32 bg-surface-dim dark:bg-surface-dim"
      aria-label="Latest Blog Posts"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-amber/10 text-brand-amber-dark dark:text-brand-amber text-sm font-medium border border-brand-amber/20 mb-6"
          >
            Insights & Guides
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Latest from the{' '}
            <span className="text-gradient-brand">Blog</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Tips, guides, and stories to help you navigate your tech journey
            with confidence.
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {blogs.map((blog, index) => {
            const gradient = gradients[index % gradients.length];
            const catStyle =
              categoryColors[blog.category] ??
              'bg-brand-teal/10 text-brand-teal';

            return (
              <motion.div
                key={blog.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                {/* Gradient Thumbnail Placeholder */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-6xl opacity-25" aria-hidden="true">
                    ✍️
                  </span>

                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${catStyle} backdrop-blur-sm`}
                    >
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-3 text-text-primary group-hover:text-brand-teal transition-colors duration-300 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-text-tertiary text-xs">
                    <div className="flex items-center gap-2">
                      {/* Author avatar placeholder */}
                      <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[10px] font-bold">
                        {blog.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="font-medium">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{blog.readingTime} min read</span>
                      <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-brand-teal/30 text-text-primary hover:text-brand-teal font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-teal/5 hover:scale-[1.02] active:scale-[0.98]"
          >
            Read More Articles
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

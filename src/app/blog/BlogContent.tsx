'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchCollection } from '@/lib/firestore';
import type { BlogPost } from '@/types';
import {
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

const gradientPalette = [
  'from-brand-teal to-brand-blue',
  'from-indigo-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-amber-400 to-orange-500',
];

function getGradient(index: number) {
  return gradientPalette[index % gradientPalette.length];
}

const categoryColorMap: Record<string, string> = {
  Career: 'bg-brand-teal/10 text-brand-teal',
  Opportunities: 'bg-brand-blue/10 text-brand-blue',
  Development: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Community: 'bg-brand-amber/10 text-brand-amber-dark',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
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

export default function BlogContent() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchCollection<BlogPost>('blogs');
        setBlogs(data);
      } catch (e) {
        console.error('Failed to load blogs:', e);
      }
    };
    loadBlogs();
  }, []);

  const published = useMemo(() => {
    return blogs.filter((b) => b.isPublished);
  }, [blogs]);

  const featured = published[0];
  const rest = published.slice(1);

  return (
    <main className="min-h-screen pt-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            <span className="text-gradient-brand">Blog</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Stories, guides, and insights from the Student Hub community to help
            you navigate your tech journey.
          </motion.p>
        </motion.div>

        {/* Featured Post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="block group"
              aria-label={`Read ${featured.title}`}
            >
              <article className="glass-card rounded-3xl overflow-hidden md:grid md:grid-cols-2">
                {/* Gradient Placeholder */}
                <div
                  className={`relative h-64 md:h-full min-h-[320px] bg-gradient-to-br ${gradientPalette[0]} flex items-center justify-center`}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 left-6 w-24 h-24 border-2 border-white/30 rounded-2xl rotate-12" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full" />
                    <div className="absolute top-12 right-16 w-8 h-8 bg-white/20 rounded-full" />
                  </div>
                  <div className="relative z-10 text-white text-center px-8">
                    <span className="text-sm font-semibold tracking-widest uppercase opacity-80">
                      Featured
                    </span>
                    <div className="mt-2 text-4xl font-display font-bold">📝</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span
                    className={`self-start inline-flex px-3 py-1 rounded-lg text-xs font-semibold mb-4 ${
                      categoryColorMap[featured.category] ??
                      'bg-surface-container text-text-secondary'
                    }`}
                  >
                    {featured.category}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-3 leading-snug group-hover:text-brand-teal transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed mb-6 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-tertiary mb-6">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineUser className="w-4 h-4" />
                      {featured.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiOutlineClock className="w-4 h-4" />
                      {featured.readingTime} min read
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-brand-teal font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    Read More
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        {rest.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rest.map((post, index) => {
              const gradient = gradientPalette[(index + 1) % gradientPalette.length];
              return (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group h-full"
                    aria-label={`Read ${post.title}`}
                  >
                    <article className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
                      {/* Gradient Placeholder */}
                      <div
                        className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-xl rotate-12" />
                          <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white/20 rounded-full" />
                        </div>
                        <div className="relative z-10 text-white text-3xl">📄</div>
                        {/* Category Tag */}
                        <div
                          className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-gray-900/80 ${
                            categoryColorMap[post.category] ??
                            'text-text-secondary'
                          }`}
                        >
                          {post.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display text-lg font-bold text-text-primary mb-2 leading-snug group-hover:text-brand-teal transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <div className="flex items-center gap-1.5">
                            <HiOutlineUser className="w-3.5 h-3.5" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiOutlineClock className="w-3.5 h-3.5" />
                            {post.readingTime} min
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
}

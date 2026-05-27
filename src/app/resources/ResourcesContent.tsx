'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockResources } from '@/data/mock';
import type { ResourceCategory, Resource } from '@/types';
import { fetchCollection } from '@/lib/firestore';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineCodeBracket,
  HiOutlinePlayCircle,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2';

const categories: Array<ResourceCategory | 'All'> = [
  'All',
  'Roadmaps',
  'PDFs',
  'Learning',
  'GitHub Repos',
  'Career Prep',
  'Tools',
];

const typeConfig: Record<
  string,
  { icon: React.ReactNode; label: string; class: string }
> = {
  pdf: {
    icon: <HiOutlineDocumentText className="w-5 h-5" />,
    label: 'PDF',
    class: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  link: {
    icon: <HiOutlineLink className="w-5 h-5" />,
    label: 'Link',
    class:
      'bg-brand-blue/10 text-brand-blue',
  },
  repo: {
    icon: <HiOutlineCodeBracket className="w-5 h-5" />,
    label: 'Repository',
    class:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  video: {
    icon: <HiOutlinePlayCircle className="w-5 h-5" />,
    label: 'Video',
    class:
      'bg-brand-amber/10 text-brand-amber-dark',
  },
};

const categoryColorMap: Record<string, string> = {
  Roadmaps: 'bg-brand-teal/10 text-brand-teal',
  PDFs: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Learning: 'bg-brand-blue/10 text-brand-blue',
  'GitHub Repos': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Career Prep': 'bg-brand-amber/10 text-brand-amber-dark',
  Tools: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:emerald-400',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function ResourcesContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'All'>(
    'All'
  );

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchCollection<Resource>('resources');
        setResources(data);
      } catch (e) {
        console.error('Failed to load resources:', e);
      }
    };
    loadResources();
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        search === '' || r.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, search, activeCategory]);

  return (
    <main className="min-h-screen pt-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            <span className="text-gradient-brand">Resources</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Free roadmaps, study materials, starter kits, and career prep tools
            — everything you need to learn, build, and get placed.
          </motion.p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              aria-label="Search resources"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/25'
                    : 'bg-surface-container text-text-secondary hover:text-text-primary border border-border'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((resource) => {
                  const typeInfo = typeConfig[resource.type];
                  return (
                    <motion.article
                      key={resource.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        {/* Type icon & Category */}
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                              categoryColorMap[resource.category] ??
                              'bg-surface-container text-text-secondary'
                            }`}
                          >
                            {resource.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeInfo.class}`}
                          >
                            {typeInfo.icon}
                            {typeInfo.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg font-bold text-text-primary mb-2 leading-snug">
                          {resource.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                          {resource.description}
                        </p>
                      </div>

                      {/* Access Button */}
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 w-full py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label={`Access ${resource.title}`}
                      >
                        Access Resource
                        <HiOutlineArrowTopRightOnSquare className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
                <HiOutlineMagnifyingGlass className="w-8 h-8 text-text-tertiary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                No resources found
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
                className="mt-6 px-6 py-3 bg-brand-teal/10 text-brand-teal font-semibold text-sm rounded-xl hover:bg-brand-teal/20 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

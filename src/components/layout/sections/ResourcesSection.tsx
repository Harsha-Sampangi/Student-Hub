'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { mockResources } from '@/data/mock';
import type { ResourceCategory } from '@/types';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

interface CategoryCard {
  title: ResourceCategory;
  icon: string;
  color: string;
  hoverColor: string;
}

const categories: CategoryCard[] = [
  {
    title: 'Roadmaps',
    icon: '🗺️',
    color: 'from-brand-teal/10 to-brand-teal/5',
    hoverColor: 'group-hover:text-brand-teal',
  },
  {
    title: 'PDFs',
    icon: '📄',
    color: 'from-brand-blue/10 to-brand-blue/5',
    hoverColor: 'group-hover:text-brand-blue',
  },
  {
    title: 'Learning',
    icon: '📖',
    color: 'from-purple-500/10 to-purple-500/5',
    hoverColor: 'group-hover:text-purple-500',
  },
  {
    title: 'GitHub Repos',
    icon: '💻',
    color: 'from-green-500/10 to-green-500/5',
    hoverColor: 'group-hover:text-green-500',
  },
  {
    title: 'Career Prep',
    icon: '🎯',
    color: 'from-brand-amber/10 to-brand-amber/5',
    hoverColor: 'group-hover:text-brand-amber-dark dark:group-hover:text-brand-amber',
  },
  {
    title: 'Tools',
    icon: '🔧',
    color: 'from-rose-500/10 to-rose-500/5',
    hoverColor: 'group-hover:text-rose-500',
  },
];

function getResourceCount(category: ResourceCategory): number {
  return mockResources.filter((r) => r.category === category).length;
}

export default function ResourcesSection() {
  return (
    <section className="py-24 sm:py-32" aria-label="Resources">
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
            className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium border border-brand-teal/20 mb-6"
          >
            Free Resources
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Level Up with{' '}
            <span className="text-gradient-brand">Resources</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Curated roadmaps, notes, repositories, and tools — everything you
            need to learn, build, and prepare for your career.
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((cat) => {
            const count = getResourceCount(cat.title);
            return (
              <motion.div key={cat.title} variants={fadeInUp}>
                <Link
                  href="/resources"
                  className={`glass-card rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center group cursor-pointer block`}
                >
                  {/* Subtle gradient bg */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}
                  >
                    <span
                      className="text-3xl sm:text-4xl"
                      role="img"
                      aria-label={cat.title}
                    >
                      {cat.icon}
                    </span>
                  </div>

                  <h3
                    className={`font-display text-lg sm:text-xl font-semibold mb-1 text-text-primary ${cat.hoverColor} transition-colors duration-300`}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-text-tertiary text-sm">
                    {count} {count === 1 ? 'resource' : 'resources'}
                  </p>
                </Link>
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
            href="/resources"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold rounded-2xl shadow-lg shadow-brand-teal/25 hover:shadow-xl hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore All Resources
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

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockOpportunities } from '@/data/mock';
import type { Opportunity, OpportunityCategory } from '@/types';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineComputerDesktop,
  HiOutlineBuildingOffice,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';

const categories: Array<OpportunityCategory | 'All'> = [
  'All',
  'Hackathon',
  'Internship',
  'Workshop',
  'Scholarship',
  'Job',
  'Open Source',
  'Coding Contest',
  'Campus Ambassador',
  'Fellowship',
];

const modes = ['All', 'online', 'offline', 'hybrid'] as const;

const categoryColorMap: Record<string, string> = {
  Hackathon: 'bg-brand-teal/10 text-brand-teal',
  Internship: 'bg-brand-blue/10 text-brand-blue',
  Workshop: 'bg-brand-amber/10 text-brand-amber-dark',
  Scholarship: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Job: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Open Source': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Coding Contest': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Campus Ambassador': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Fellowship: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function ModeIcon({ mode }: { mode: string }) {
  switch (mode) {
    case 'online':
      return <HiOutlineComputerDesktop className="w-4 h-4" />;
    case 'offline':
      return <HiOutlineBuildingOffice className="w-4 h-4" />;
    default:
      return <HiOutlineGlobeAlt className="w-4 h-4" />;
  }
}

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OpportunitiesContent() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | 'All'>('All');
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]>('All');

  useEffect(() => {
    const saved = localStorage.getItem('sh_opportunities');
    if (saved) {
      try {
        setOpportunities(JSON.parse(saved));
      } catch (e) {
        setOpportunities(mockOpportunities);
      }
    } else {
      setOpportunities(mockOpportunities);
    }
  }, []);

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      // Only show active opportunities on the public side
      if (!opp.isActive) return false;
      const matchesSearch =
        search === '' || opp.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || opp.category === activeCategory;
      const matchesMode = activeMode === 'All' || opp.mode === activeMode;
      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [opportunities, search, activeCategory, activeMode]);

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
            <span className="text-gradient-brand">Opportunities</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Curated hackathons, internships, scholarships, and more — everything
            you need to accelerate your career, all in one place.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
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
              placeholder="Search opportunities by title..."
              aria-label="Search opportunities"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/25'
                    : 'bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container/80 border border-border'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mode Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex gap-2 justify-center mb-12"
        >
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeMode === mode
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                  : 'bg-surface-container text-text-secondary hover:text-text-primary border border-border'
              }`}
              aria-pressed={activeMode === mode}
            >
              {mode !== 'All' && <ModeIcon mode={mode} />}
              {mode === 'All' ? 'All Modes' : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-text-tertiary text-center">
          Showing {filtered.length} of {opportunities.length} opportunities
        </div>

        {/* Opportunity Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((opp) => (
                  <motion.article
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                  >
                    {/* Top */}
                    <div>
                      {/* Category Badge & Mode */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            categoryColorMap[opp.category] ??
                            'bg-surface-container text-text-secondary'
                          }`}
                        >
                          {opp.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-text-tertiary font-medium capitalize">
                          <ModeIcon mode={opp.mode} />
                          {opp.mode}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg font-bold text-text-primary mb-2 leading-snug">
                        {opp.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                        {opp.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-col gap-2 mb-5 text-sm text-text-tertiary">
                        <div className="flex items-center gap-2">
                          <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                          <span>{opp.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlineClock className="w-4 h-4 shrink-0" />
                          <span>Deadline: {formatDeadline(opp.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlineGlobeAlt className="w-4 h-4 shrink-0" />
                          <span>{opp.platform}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <a
                      href={opp.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 w-full py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      aria-label={`Apply now for ${opp.title}`}
                    >
                      Apply Now
                      <HiOutlineArrowTopRightOnSquare className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
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
                No opportunities found
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Try adjusting your search or filters to discover more
                opportunities.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                  setActiveMode('All');
                }}
                className="mt-6 px-6 py-3 bg-brand-teal/10 text-brand-teal font-semibold text-sm rounded-xl hover:bg-brand-teal/20 transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

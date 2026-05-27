'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchCollection } from '@/lib/firestore';
import type { OpportunityCategory, Opportunity } from '@/types';

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

const categoryBadgeColors: Record<OpportunityCategory, string> = {
  Hackathon: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
  Internship: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
  'Open Source': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Fellowship: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Coding Contest': 'bg-brand-amber/10 text-brand-amber-dark dark:text-brand-amber border-brand-amber/20',
  'Campus Ambassador': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  Scholarship: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Job: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  Workshop: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
};

const modeStyles: Record<string, string> = {
  online: 'bg-green-500/10 text-green-600 dark:text-green-400',
  offline: 'bg-brand-blue/10 text-brand-blue',
  hybrid: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OpportunitiesPreview() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await fetchCollection<Opportunity>('opportunities');
        setOpportunities(data.filter((opp) => opp.isActive).slice(0, 4));
      } catch (e) {
        console.error('Failed to load opportunities preview:', e);
      }
    };
    loadOpportunities();
  }, []);

  return (
    <section
      className="py-24 sm:py-32 bg-surface-dim dark:bg-surface-dim"
      aria-label="Opportunities Preview"
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
            className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium border border-brand-teal/20 mb-6"
          >
            Don&apos;t Miss Out
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Latest{' '}
            <span className="text-gradient-brand">Opportunities</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Handpicked opportunities to help you learn, build, and launch your
            career in tech.
          </motion.p>
        </motion.div>

        {/* Opportunities Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {opportunities.map((opp) => (
            <motion.div
              key={opp.id}
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-card rounded-2xl p-6 flex flex-col group"
            >
              {/* Category + Mode */}
              <div className="flex items-center justify-between mb-4 gap-2">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${categoryBadgeColors[opp.category]}`}
                >
                  {opp.category}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${modeStyles[opp.mode]}`}
                >
                  {opp.mode}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold mb-3 text-text-primary group-hover:text-brand-teal transition-colors duration-300 leading-snug">
                {opp.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>{opp.location}</span>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
                <span>Deadline: {formatDate(opp.deadline)}</span>
              </div>

              {/* Apply Link */}
              <div className="mt-auto">
                <a
                  href={opp.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-teal font-medium text-sm hover:text-brand-teal-dark transition-colors duration-300 group/link"
                  aria-label={`Apply for ${opp.title}`}
                >
                  Apply Now
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
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
                </a>
              </div>
            </motion.div>
          ))}
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
            href="/opportunities"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-brand-teal/30 text-text-primary hover:text-brand-teal font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-teal/5 hover:scale-[1.02] active:scale-[0.98]"
          >
            View All Opportunities
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

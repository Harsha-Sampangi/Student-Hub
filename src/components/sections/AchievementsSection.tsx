'use client';

import { motion } from 'framer-motion';
import { mockAchievements } from '@/data/mock';

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

const categoryColors: Record<string, { border: string; badge: string; text: string }> = {
  Hackathon: {
    border: 'border-l-brand-teal',
    badge: 'bg-brand-teal/10 text-brand-teal',
    text: 'Hackathon',
  },
  'Open Source': {
    border: 'border-l-green-500',
    badge: 'bg-green-500/10 text-green-600 dark:text-green-400',
    text: 'Open Source',
  },
  Placement: {
    border: 'border-l-brand-blue',
    badge: 'bg-brand-blue/10 text-brand-blue',
    text: 'Placement',
  },
  Research: {
    border: 'border-l-purple-500',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    text: 'Research',
  },
  Fellowship: {
    border: 'border-l-brand-amber',
    badge: 'bg-brand-amber/10 text-brand-amber-dark dark:text-brand-amber',
    text: 'Fellowship',
  },
};

function getCategoryStyle(category: string) {
  return (
    categoryColors[category] ?? {
      border: 'border-l-brand-teal',
      badge: 'bg-brand-teal/10 text-brand-teal',
      text: category,
    }
  );
}

export default function AchievementsSection() {
  return (
    <section className="py-24 sm:py-32" aria-label="Community Achievements">
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
            Proud Moments
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Community{' '}
            <span className="text-gradient-brand">Achievements</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Celebrating the incredible accomplishments of students in our
            community who&apos;re making waves across India.
          </motion.p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {mockAchievements.map((achievement) => {
            const style = getCategoryStyle(achievement.category);
            return (
              <motion.div
                key={achievement.id}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className={`glass-card rounded-2xl p-8 border-l-4 ${style.border} group cursor-default`}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <span
                    className="text-4xl sm:text-5xl shrink-0"
                    role="img"
                    aria-label={achievement.title}
                  >
                    {achievement.icon}
                  </span>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-text-primary group-hover:text-brand-teal transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}
                      >
                        {style.text}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-3">
                      {achievement.description}
                    </p>
                    <p className="text-text-tertiary text-sm flex items-center gap-1.5">
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
                          strokeWidth={1.5}
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      {achievement.student}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { mockStats } from '@/data/mock';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

interface StatItem {
  label: string;
  value: number;
  icon: string;
}

const stats: StatItem[] = [
  { label: 'Students Reached', value: mockStats.studentsReached, icon: '👥' },
  { label: 'Opportunities Shared', value: mockStats.opportunitiesShared, icon: '🎯' },
  { label: 'Events Hosted', value: mockStats.eventsHosted, icon: '📅' },
  { label: 'Community Members', value: mockStats.communityMembers, icon: '🤝' },
];

function formatNumber(num: number): string {
  if (num >= 1000) {
    return num.toLocaleString('en-IN');
  }
  return num.toString();
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const duration = 2000;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }
    requestAnimationFrame(step);
  }, [target]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}+
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      className="py-24 sm:py-32 relative overflow-hidden"
      aria-label="Community Statistics"
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-brand-blue/5 to-brand-teal/5 dark:from-brand-teal/10 dark:via-brand-blue/10 dark:to-brand-teal/10"
        aria-hidden="true"
      />
      {/* Decorative orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/8 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/8 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Our Impact
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Numbers That{' '}
            <span className="text-gradient-brand">Speak</span>
          </motion.h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center group"
            >
              <span
                className="text-3xl sm:text-4xl block mb-4"
                role="img"
                aria-label={stat.label}
              >
                {stat.icon}
              </span>
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-teal mb-2">
                <AnimatedCounter target={stat.value} />
              </div>
              <p className="text-text-secondary text-sm sm:text-base font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

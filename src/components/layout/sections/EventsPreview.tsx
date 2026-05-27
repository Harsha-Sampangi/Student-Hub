'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchCollection } from '@/lib/firestore';
import type { Event } from '@/types';

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
  'from-brand-teal to-brand-blue',
  'from-brand-blue to-purple-500',
  'from-brand-teal-dark to-brand-teal',
  'from-purple-500 to-brand-blue',
];

const modeDotColors: Record<string, string> = {
  online: 'bg-green-400',
  offline: 'bg-brand-blue',
  hybrid: 'bg-purple-400',
};

function formatEventDate(dateStr: string): { day: string; month: string; year: string } {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    year: date.getFullYear().toString(),
  };
}

export default function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchCollection<Event>('events');
        setEvents(data.filter((evt) => evt.isActive).slice(0, 3));
      } catch (e) {
        console.error('Failed to load events preview:', e);
      }
    };
    loadEvents();
  }, []);

  return (
    <section className="py-24 sm:py-32" aria-label="Upcoming Events">
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
            className="inline-block px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium border border-brand-blue/20 mb-6"
          >
            Mark Your Calendar
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Upcoming{' '}
            <span className="text-gradient-brand">Events</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Workshops, bootcamps, and community events designed to help you
            level up your skills.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {events.map((event, index) => {
            const { day, month } = formatEventDate(event.date);
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                {/* Gradient Poster Placeholder */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                    aria-hidden="true"
                  />
                  {/* Large decorative icon */}
                  <span className="text-6xl opacity-30" aria-hidden="true">
                    📅
                  </span>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 glass rounded-xl px-3 py-2 text-center min-w-[56px]">
                    <span className="block text-xl font-bold text-white leading-none">
                      {day}
                    </span>
                    <span className="block text-[10px] font-semibold text-white/80 uppercase tracking-wider mt-0.5">
                      {month}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Mode Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`w-2 h-2 rounded-full ${modeDotColors[event.mode]}`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-text-secondary capitalize">
                      {event.mode}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 text-text-primary group-hover:text-brand-teal transition-colors duration-300 leading-snug">
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-text-tertiary text-sm mb-5">
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
                    <span>{event.location}</span>
                  </div>

                  {/* Register Button */}
                  <a
                    href={event.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-5 py-3 bg-brand-teal/10 hover:bg-brand-teal hover:text-white text-brand-teal font-semibold text-sm rounded-xl transition-all duration-300"
                    aria-label={`Register for ${event.title}`}
                  >
                    Register Now
                  </a>
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
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-brand-teal/30 text-text-primary hover:text-brand-teal font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-teal/5 hover:scale-[1.02] active:scale-[0.98]"
          >
            View All Events
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

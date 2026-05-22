'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockEvents } from '@/data/mock';
import type { Event } from '@/types';
import {
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineComputerDesktop,
  HiOutlineBuildingOffice,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';

const modes = ['All', 'online', 'offline', 'hybrid'] as const;

const gradientPalette = [
  'from-brand-teal to-brand-blue',
  'from-brand-blue to-indigo-500',
  'from-brand-amber to-orange-500',
  'from-emerald-400 to-brand-teal',
  'from-purple-500 to-brand-blue',
  'from-pink-500 to-brand-amber',
];

const modeConfig: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  online: {
    label: 'Online',
    icon: <HiOutlineComputerDesktop className="w-3.5 h-3.5" />,
    class: 'bg-brand-teal/10 text-brand-teal',
  },
  offline: {
    label: 'Offline',
    icon: <HiOutlineBuildingOffice className="w-3.5 h-3.5" />,
    class: 'bg-brand-blue/10 text-brand-blue',
  },
  hybrid: {
    label: 'Hybrid',
    icon: <HiOutlineGlobeAlt className="w-3.5 h-3.5" />,
    class: 'bg-brand-amber/10 text-brand-amber-dark',
  },
};

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    full: date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]>('All');

  useEffect(() => {
    const saved = localStorage.getItem('sh_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(mockEvents);
      }
    } else {
      setEvents(mockEvents);
    }
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (!e.isActive) return false;
      if (activeMode === 'All') return true;
      return e.mode === activeMode;
    });
  }, [events, activeMode]);

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
            <span className="text-gradient-brand">Events</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Workshops, bootcamps, and community meetups — stay ahead with
            hands-on learning experiences led by industry experts.
          </motion.p>
        </motion.div>

        {/* Mode Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-2 justify-center mb-12"
        >
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeMode === mode
                  ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/25'
                  : 'bg-surface-container text-text-secondary hover:text-text-primary border border-border'
              }`}
              aria-pressed={activeMode === mode}
            >
              {mode === 'All'
                ? 'All Events'
                : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((event, index) => {
                  const dateInfo = formatEventDate(event.date);
                  const mode = modeConfig[event.mode];
                  const gradient = gradientPalette[index % gradientPalette.length];
                  return (
                    <motion.article
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="glass-card rounded-2xl overflow-hidden flex flex-col"
                    >
                      {/* Gradient Placeholder */}
                      <div
                        className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                        aria-hidden="true"
                      >
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-xl rotate-12" />
                          <div className="absolute bottom-6 right-6 w-12 h-12 border-2 border-white/20 rounded-full" />
                          <div className="absolute top-8 right-12 w-6 h-6 bg-white/20 rounded-full" />
                        </div>
                        {/* Date overlay */}
                        <div className="relative z-10 text-center text-white">
                          <div className="text-5xl font-display font-bold leading-none">
                            {dateInfo.day}
                          </div>
                          <div className="text-sm font-semibold tracking-widest mt-1">
                            {dateInfo.month}
                          </div>
                        </div>
                        {/* Mode Badge */}
                        <div
                          className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-gray-900/80 ${mode.class}`}
                        >
                          {mode.icon}
                          {mode.label}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display text-xl font-bold text-text-primary mb-2 leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                          {event.description}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-col gap-2 mb-5 text-sm text-text-tertiary">
                          <div className="flex items-center gap-2">
                            <HiOutlineCalendarDays className="w-4 h-4 shrink-0" />
                            <span>{dateInfo.full}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Register Button */}
                        <a
                          href={event.registerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-center gap-2 w-full py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          aria-label={`Register for ${event.title}`}
                        >
                          Register
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                <HiOutlineCalendarDays className="w-8 h-8 text-text-tertiary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                No events found
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                No events match this filter. Try selecting a different mode.
              </p>
              <button
                onClick={() => setActiveMode('All')}
                className="mt-6 px-6 py-3 bg-brand-teal/10 text-brand-teal font-semibold text-sm rounded-xl hover:bg-brand-teal/20 transition-colors duration-300"
              >
                Show All Events
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

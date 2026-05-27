'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import JoinCommunityModal from './JoinCommunityModal';
import Link from 'next/link';

export default function HeroSection() {
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" aria-label="Hero">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-brand-teal/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-brand-amber/10 blur-3xl"
        />

        {/* Floating geometric shapes */}
        <motion.div animate={{ y: [-12, 12, -12], rotate: [0, 180, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[15%] w-8 h-8 border-2 border-brand-teal/20 rounded-lg" />
        <motion.div animate={{ y: [12, -12, 12], rotate: [0, -90, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-48 right-[20%] w-6 h-6 bg-brand-amber/20 rounded-full" />
        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 left-[10%] w-4 h-4 bg-brand-blue/20 rounded-full" />
        <motion.div animate={{ y: [8, -8, 8], rotate: [45, 135, 45] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-60 right-[15%] w-10 h-10 border-2 border-brand-amber/15 rounded-xl" />
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] left-[60%] w-3 h-3 bg-brand-teal/30 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium border border-brand-teal/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            Open Community for Indian Students
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          India&apos;s Open{' '}
          <span className="text-gradient-brand">
            Student Community
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl sm:text-2xl text-text-secondary font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Learn. Build. Grow Together.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg text-text-tertiary max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Connecting 5,000+ students with hackathons, internships, workshops, and the resources they need to thrive in tech.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => setJoinOpen(true)}
            className="group relative px-8 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold rounded-2xl shadow-lg shadow-brand-teal/25 hover:shadow-xl hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              Join Community
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <Link
            href="/opportunities"
            className="px-8 py-4 border border-border hover:border-brand-teal/30 text-text-primary hover:text-brand-teal font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-teal/5 hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            Explore Opportunities
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-text-tertiary"
        >
          <div className="flex items-center gap-2 text-sm">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface ${
                  ['bg-brand-teal', 'bg-brand-blue', 'bg-brand-amber', 'bg-brand-teal-dark'][i]
                } flex items-center justify-center text-white text-xs font-bold`}>
                  {['H', 'A', 'V', 'S'][i]}
                </div>
              ))}
            </div>
            <span>5,000+ students joined</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-brand-amber">★★★★★</span>
            <span>Loved by students across India</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-text-tertiary/30 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-text-tertiary/50" />
        </motion.div>
      </motion.div>

      <JoinCommunityModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
    </section>
  );
}

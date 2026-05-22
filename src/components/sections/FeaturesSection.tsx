'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: '🏆',
    title: 'Hackathons',
    description:
      'Compete in India\'s top hackathons and build innovative solutions with fellow developers.',
    color: 'from-brand-teal/20 to-brand-teal/5',
  },
  {
    icon: '💼',
    title: 'Internships',
    description:
      'Curated internship opportunities at startups and top tech companies across India.',
    color: 'from-brand-blue/20 to-brand-blue/5',
  },
  {
    icon: '🔧',
    title: 'Workshops',
    description:
      'Hands-on workshops on in-demand technologies led by experienced developers and mentors.',
    color: 'from-brand-amber/20 to-brand-amber/5',
  },
  {
    icon: '🤖',
    title: 'AI Events',
    description:
      'Explore AI/ML through dedicated events, paper reading groups, and project showcases.',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: '🌐',
    title: 'Open Source',
    description:
      'Guided open-source contributions with mentorship to build your developer profile.',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: '⚡',
    title: 'Coding Contests',
    description:
      'Weekly coding challenges and competitive programming practice with peers.',
    color: 'from-brand-amber/20 to-brand-amber/5',
  },
  {
    icon: '🎓',
    title: 'Campus Ambassador',
    description:
      'Represent Student Hub at your college and lead your campus community.',
    color: 'from-brand-teal/20 to-brand-teal/5',
  },
  {
    icon: '📚',
    title: 'Scholarships',
    description:
      'Discover merit-based and need-based scholarship programs from top organizations.',
    color: 'from-brand-blue/20 to-brand-blue/5',
  },
  {
    icon: '🚀',
    title: 'Jobs',
    description:
      'Entry-level and fresher job opportunities at companies actively hiring from communities.',
    color: 'from-rose-500/20 to-rose-500/5',
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-24 sm:py-32 bg-surface-dim dark:bg-surface-dim"
      aria-label="Features"
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
            className="inline-block px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium border border-brand-blue/20 mb-6"
          >
            Community Features
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            What We{' '}
            <span className="text-gradient-brand">Offer</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to kickstart and accelerate your tech career —
            all under one roof.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.3 },
              }}
              className="glass-card rounded-2xl p-8 group cursor-default relative overflow-hidden"
            >
              {/* Subtle gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <span
                  className="text-4xl block mb-4"
                  role="img"
                  aria-label={feature.title}
                >
                  {feature.icon}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 text-text-primary group-hover:text-brand-teal transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

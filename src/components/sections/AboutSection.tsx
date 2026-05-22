'use client';

import { motion } from 'framer-motion';

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

interface ValuePillar {
  icon: string;
  title: string;
  description: string;
}

const valuePillars: ValuePillar[] = [
  {
    icon: '👥',
    title: 'Built by Students, for Students',
    description:
      'A community created and run by passionate students who understand the challenges and aspirations of their peers across India.',
  },
  {
    icon: '🎯',
    title: 'Connecting with Opportunities',
    description:
      'Curated hackathons, internships, scholarships, and open-source programs — all in one place so you never miss out.',
  },
  {
    icon: '💻',
    title: 'Growing in Tech',
    description:
      'Workshops, roadmaps, mentorship, and resources designed to help you build real-world skills and a standout developer profile.',
  },
  {
    icon: '🇮🇳',
    title: 'Pan-India Vision',
    description:
      "From metros to small towns, we're bridging the opportunity gap and empowering students in every corner of India.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 sm:py-32" aria-label="About Student Hub">
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
            Our Mission
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            What is{' '}
            <span className="text-gradient-brand">Student Hub</span>?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re building India&apos;s largest open student community — a
            space where students learn, build, and grow together through shared
            opportunities, resources, and real connections.
          </motion.p>
        </motion.div>

        {/* Value Pillars Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {valuePillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-card rounded-2xl p-8 sm:p-10 group cursor-default"
            >
              <span
                className="text-4xl sm:text-5xl block mb-5"
                role="img"
                aria-label={pillar.title}
              >
                {pillar.icon}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold mb-3 text-text-primary group-hover:text-brand-teal transition-colors duration-300">
                {pillar.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-base">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

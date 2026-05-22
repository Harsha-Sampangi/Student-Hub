'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineLightBulb,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineRocketLaunch,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

const milestones = [
  {
    year: '2024',
    title: 'Founded',
    description:
      'Student Hub was born from a simple idea — connect Indian students with the opportunities they deserve.',
    icon: '🚀',
  },
  {
    year: '2024',
    title: 'First Event',
    description:
      'Hosted our first community event — a web development workshop that brought together 100+ students from across the country.',
    icon: '🎉',
  },
  {
    year: '2025',
    title: '1,000 Members',
    description:
      'Crossed the 1,000-member milestone, proving that students crave a supportive, opportunity-rich community.',
    icon: '🎯',
  },
  {
    year: '2025',
    title: 'Pan-India Expansion',
    description:
      'Expanded our reach to 50+ colleges across India with campus ambassadors championing the community.',
    icon: '🗺️',
  },
  {
    year: '2026',
    title: '5,000+ Community',
    description:
      'Today, we are a thriving community of 5,000+ students, 500+ opportunities shared, and 50+ events hosted.',
    icon: '🌟',
  },
];

const coreValues = [
  {
    title: 'Innovation',
    description:
      'We encourage creative thinking and building solutions that push boundaries. Every student has the potential to innovate.',
    icon: <HiOutlineLightBulb className="w-7 h-7" />,
    color: 'text-brand-amber',
    bgColor: 'bg-brand-amber/10',
  },
  {
    title: 'Community',
    description:
      'We believe in the power of togetherness. Learning is better when done together, and success is sweeter when shared.',
    icon: <HiOutlineUserGroup className="w-7 h-7" />,
    color: 'text-brand-teal',
    bgColor: 'bg-brand-teal/10',
  },
  {
    title: 'Growth',
    description:
      'Continuous learning is at our core. We provide resources, mentorship, and opportunities for every stage of your journey.',
    icon: <HiOutlineAcademicCap className="w-7 h-7" />,
    color: 'text-brand-blue',
    bgColor: 'bg-brand-blue/10',
  },
  {
    title: 'Impact',
    description:
      'Every opportunity shared, every event hosted, and every connection made creates a ripple effect that transforms careers.',
    icon: <HiOutlineRocketLaunch className="w-7 h-7" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AboutContent() {
  return (
    <main className="min-h-screen pt-24">
      {/* Hero / Mission Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-brand-teal/5 blur-3xl" />
          <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium border border-brand-teal/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              Our Story
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Empowering India&apos;s{' '}
              <span className="text-gradient-brand">Next Generation</span>{' '}
              of Tech Leaders
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-4"
            >
              Student Hub is India&apos;s largest open student community — a
              platform built by students, for students. We bridge the gap
              between ambition and opportunity by curating hackathons,
              internships, workshops, and resources that help students learn,
              build, and grow together.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-base text-text-tertiary max-w-2xl mx-auto leading-relaxed"
            >
              We believe every student deserves access to world-class
              opportunities — regardless of which college they attend or which
              city they live in.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Journey / Timeline Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Our <span className="text-brand-teal">Journey</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-lg max-w-xl mx-auto"
          >
            From a spark of an idea to a thriving community — here&apos;s how we
            got here.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-px"
            aria-hidden="true"
          />

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                index % 2 === 0
                  ? 'sm:flex-row'
                  : 'sm:flex-row-reverse'
              }`}
            >
              {/* Dot */}
              <div
                className="absolute left-6 sm:left-1/2 w-3 h-3 rounded-full bg-brand-teal border-4 border-surface z-10 -translate-x-1/2 mt-6 sm:mt-6"
                aria-hidden="true"
              />

              {/* Content Card */}
              <div
                className={`ml-14 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'
                }`}
              >
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" role="img" aria-label={milestone.title}>
                      {milestone.icon}
                    </span>
                    <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-lg">
                      {milestone.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-surface-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            >
              Our Core <span className="text-brand-teal">Values</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary text-lg max-w-xl mx-auto"
            >
              The principles that guide everything we do at Student Hub.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${value.bgColor} flex items-center justify-center mx-auto mb-4 ${value.color}`}
                >
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-6"
          >
            Our Vision for the{' '}
            <span className="text-gradient-brand">Future</span>
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="glass-card rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto"
          >
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-6">
              We envision a future where every student in India — from tier-1
              cities to small towns — has equal access to opportunities,
              mentorship, and the community support they need to build
              extraordinary careers in technology.
            </p>
            <p className="text-base text-text-tertiary leading-relaxed">
              Student Hub aims to become the default launchpad for India&apos;s
              next million tech professionals — connecting talent with
              opportunity at scale, fostering innovation through collaboration,
              and proving that great potential exists everywhere.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-dim">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            >
              Ready to{' '}
              <span className="text-brand-teal">Join the Movement</span>?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary text-lg max-w-xl mx-auto mb-8"
            >
              Be part of India&apos;s fastest growing student community.
              Discover opportunities, attend events, learn from peers, and grow
              together.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/opportunities"
                className="group px-8 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold rounded-2xl shadow-lg shadow-brand-teal/25 hover:shadow-xl hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base flex items-center gap-2"
              >
                Explore Opportunities
                <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-border hover:border-brand-teal/30 text-text-primary hover:text-brand-teal font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-teal/5 hover:scale-[1.02] active:scale-[0.98] text-base"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

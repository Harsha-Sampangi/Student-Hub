'use client';

import { motion } from 'framer-motion';
import { mockTeam } from '@/data/mock';
import {
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';

const avatarColors = [
  'from-brand-teal to-brand-blue',
  'from-brand-blue to-indigo-500',
  'from-brand-amber to-orange-500',
  'from-emerald-400 to-brand-teal',
  'from-purple-500 to-brand-blue',
  'from-pink-500 to-brand-amber',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function TeamContent() {
  const sortedTeam = [...mockTeam].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen pt-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            Meet Our{' '}
            <span className="text-gradient-brand">Team</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            The passionate individuals driving Student Hub&apos;s mission to
            empower students across India.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sortedTeam.map((member, index) => {
            const gradient = avatarColors[index % avatarColors.length];
            const initials = member.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <motion.article
                key={member.id}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl p-8 text-center group cursor-default"
              >
                {/* Avatar with Initials */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <span className="text-2xl font-display font-bold text-white">
                      {initials}
                    </span>
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-brand-teal/0 group-hover:border-brand-teal/30 transition-all duration-500 scale-100 group-hover:scale-110" />
                </div>

                {/* Name & Role */}
                <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-brand-teal mb-4">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-surface-container hover:bg-brand-blue/10 flex items-center justify-center text-text-tertiary hover:text-brand-blue transition-all duration-300"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <FaLinkedinIn className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container/80 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-all duration-300"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-surface-container hover:bg-pink-100 dark:hover:bg-pink-900/20 flex items-center justify-center text-text-tertiary hover:text-pink-500 transition-all duration-300"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <FaInstagram className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-surface-container hover:bg-brand-blue/10 flex items-center justify-center text-text-tertiary hover:text-brand-blue transition-all duration-300"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <HiOutlineGlobeAlt className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}

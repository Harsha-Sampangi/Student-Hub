'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaDiscord, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { HiOutlineX } from 'react-icons/hi';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platforms = [
  {
    name: 'WhatsApp',
    description: 'Join our WhatsApp community group',
    icon: FaWhatsapp,
    url: 'https://chat.whatsapp.com/DkrDS0ajX4pGqy1D1O0QXt?mode=gi_t',
    gradient: 'from-green-400 to-green-600',
    shadow: 'shadow-green-500/25',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-950/30',
  },
    {
    name: 'Instagram',
    description: 'Follow us for daily updates',
    icon: FaInstagram,
    url: 'https://instagram.com/studenthub',
    gradient: 'from-pink-400 via-purple-500 to-orange-400',
    shadow: 'shadow-pink-500/25',
    hoverBg: 'hover:bg-pink-50 dark:hover:bg-pink-950/30',
  },
  {
    name: 'LinkedIn',
    description: 'Connect professionally',
    icon: FaLinkedinIn,
    url: 'https://linkedin.com/company/studenthub',
    gradient: 'from-blue-500 to-blue-700',
    shadow: 'shadow-blue-500/25',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
  },
  {
    name: 'Discord',
    description: 'Chat, collaborate, and grow together',
    icon: FaDiscord,
    url: 'https://discord.gg/studenthub',
    gradient: 'from-indigo-400 to-indigo-600',
    shadow: 'shadow-indigo-500/25',
    hoverBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/30',
  },
];

export default function JoinCommunityModal({ isOpen, onClose }: JoinCommunityModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-surface dark:bg-surface-elevated rounded-3xl shadow-elevated p-8 z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Join Student Hub Community"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-container transition-all duration-200"
              aria-label="Close modal"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue text-white text-2xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                Join Student Hub
              </h2>
              <p className="text-sm text-text-secondary">
                Choose your preferred platform to connect with 5,000+ students across India.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              {platforms.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border border-border ${platform.hoverBg} transition-all duration-300 group`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} shadow-lg ${platform.shadow} flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}>
                    <platform.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text-primary">{platform.name}</p>
                    <p className="text-xs text-text-tertiary">{platform.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

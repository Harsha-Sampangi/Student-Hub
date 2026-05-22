'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import JoinCommunityModal from '@/components/sections/JoinCommunityModal';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-glass py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Student Hub — Home">
            <Image
              src="/images/logo.png"
              alt="Student Hub Logo"
              width={44}
              height={44}
              className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-display text-xl font-bold tracking-tight text-text-primary hidden sm:block">
              Student<span className="text-brand-teal">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-brand-teal'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-container'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-teal rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-container transition-all duration-300"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiOutlineMoon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiOutlineSun className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Join CTA */}
            <button
              onClick={() => setJoinModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join Community
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-container transition-all duration-300"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenuAlt3 className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-surface dark:bg-surface z-50 lg:hidden shadow-elevated p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-lg font-bold tracking-tight">
                  Student<span className="text-brand-teal">Hub</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-container transition-colors"
                  aria-label="Close menu"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-brand-teal/10 text-brand-teal'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-container'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => { setMobileOpen(false); setJoinModalOpen(true); }}
                className="w-full mt-4 px-5 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-teal/20 transition-all duration-300"
              >
                Join Community
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Join Community Modal */}
      <JoinCommunityModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineExclamationTriangle,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

export default function AdminLoginClient() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      router.replace('/admin');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in.';
      if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
        setError('Invalid email or password.');
      } else if (message.includes('auth/too-many-requests')) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-admin-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-3 border-admin-brand/20 border-t-admin-brand"
        />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-admin-background overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-admin-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full bg-admin-brand/5 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        <div className="rounded-[24px] border border-admin-border/50 bg-admin-surface p-8 sm:p-10 shadow-admin-lg relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-admin-brand/20 via-admin-brand to-admin-brand/20 opacity-80" />

          {/* Branding */}
          <div className="mb-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-brand/10 border border-admin-brand/20 text-admin-brand"
            >
              <HiOutlineAcademicCap className="h-7 w-7" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl font-bold text-admin-text-primary font-display tracking-tight"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-2 text-sm text-admin-text-tertiary"
            >
              Sign in to the Student Hub Admin Portal
            </motion.p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600"
                role="alert"
              >
                <HiOutlineExclamationTriangle className="h-5 w-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-admin-text-secondary"
              >
                Email Address
              </label>
              <div className="relative group">
                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-admin-text-tertiary group-focus-within:text-admin-brand transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studenthub.in"
                  className="w-full rounded-xl border border-admin-border bg-admin-surface-container py-2.5 pl-10 pr-4 text-[14px] text-admin-text-primary placeholder:text-admin-text-tertiary transition-all duration-200 focus:border-admin-brand focus:bg-admin-surface focus:outline-none focus:ring-4 focus:ring-admin-brand/10"
                  aria-label="Email address"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-admin-text-secondary"
              >
                Password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-admin-text-tertiary group-focus-within:text-admin-brand transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-admin-border bg-admin-surface-container py-2.5 pl-10 pr-4 text-[14px] text-admin-text-primary placeholder:text-admin-text-tertiary transition-all duration-200 focus:border-admin-brand focus:bg-admin-surface focus:outline-none focus:ring-4 focus:ring-admin-brand/10"
                  aria-label="Password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full rounded-xl bg-admin-text-primary py-3 text-[14px] font-medium text-admin-surface shadow-sm transition-all duration-200 hover:bg-admin-text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              aria-label="Sign in"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-admin-surface/30 border-t-admin-surface"
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-[12px] text-admin-text-tertiary">
            Protected system. Authorized access only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

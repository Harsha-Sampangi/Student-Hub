'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import {
  HiOutlineChartBarSquare,
  HiOutlineRocketLaunch,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
  HiOutlineBookOpen,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: HiOutlineChartBarSquare },
  { label: 'Opportunities', href: '/admin/opportunities', icon: HiOutlineRocketLaunch },
  { label: 'Events', href: '/admin/events', icon: HiOutlineCalendarDays },
  { label: 'Blog', href: '/admin/blog', icon: HiOutlinePencilSquare },
  { label: 'Resources', href: '/admin/resources', icon: HiOutlineBookOpen },
];

function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-3 border-brand-teal/20 border-t-brand-teal"
        />
      </div>
    );
  }

  // Login page renders without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) return null;

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-surface-dim dark:bg-[#0a0e14]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-label="Close sidebar"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface dark:bg-[#0d1117] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue">
            <HiOutlineAcademicCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary font-display">
              Student Hub
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
              Admin
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-text-tertiary hover:bg-surface-container lg:hidden"
            aria-label="Close sidebar"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Admin navigation">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/15'
                    : 'text-text-secondary hover:bg-surface-container hover:text-text-primary'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active
                      ? 'text-brand-teal'
                      : 'text-text-tertiary group-hover:text-text-secondary'
                  }`}
                />
                {link.label}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-teal"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
            aria-label="Sign out"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-xl dark:bg-[#0d1117]/80 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-container lg:hidden"
            aria-label="Open sidebar"
          >
            <HiOutlineBars3 className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-semibold text-text-primary font-display">
            Admin Panel
          </h1>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-xs text-text-tertiary sm:block">
              {user.email}
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-xs font-bold text-white uppercase">
              {user.email?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

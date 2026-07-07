'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import {
  LayoutDashboard,
  Rocket,
  Calendar,
  PenTool,
  BookOpen,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Bell,
  Search,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import './admin.css';

const sidebarGroups = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Content',
    items: [
      { label: 'Opportunities', href: '/admin/opportunities', icon: Rocket },
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Blogs', href: '/admin/blog', icon: PenTool },
      { label: 'Resources', href: '/admin/resources', icon: BookOpen },
    ]
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load collapsed state from localStorage
    const stored = localStorage.getItem('sh_admin_sidebar_collapsed');
    if (stored) {
      setSidebarCollapsed(stored === 'true');
    }
  }, []);

  const toggleSidebarCollapse = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('sh_admin_sidebar_collapsed', String(next));
  };

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-admin-surface">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-3 border-admin-brand/20 border-t-admin-brand"
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user.email ? user.email.split('@')[0] : 'Admin';
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="admin-portal fixed inset-0 z-50 flex overflow-hidden font-sans">
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
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-admin-border/50 bg-admin-surface transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:w-auto'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-admin-border/50 px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-admin-brand text-white shadow-admin-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap flex flex-col justify-center"
              >
                <p className="text-[15px] font-semibold text-admin-text-primary tracking-tight leading-tight">
                  Student Hub
                </p>
                <p className="text-[11px] font-medium text-admin-text-tertiary leading-tight mt-0.5">
                  Admin Portal
                </p>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-admin-text-tertiary hover:bg-admin-surface-container lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 custom-scrollbar" aria-label="Admin navigation">
          {sidebarGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-admin-text-tertiary mb-2">
                  {group.label}
                </p>
              )}
              {group.items.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={sidebarCollapsed ? link.label : undefined}
                    className="relative group flex items-center rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-admin-border"
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Active Indicator Line */}
                    {active && !sidebarCollapsed && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-admin-brand"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    <div className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-admin-surface-container text-admin-text-primary shadow-admin-sm border border-admin-border/50'
                        : 'text-admin-text-secondary border border-transparent hover:bg-admin-surface-container/50 hover:text-admin-text-primary'
                    }`}>
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          active ? 'text-admin-text-primary' : 'text-admin-text-tertiary group-hover:text-admin-text-secondary'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="text-[14px] truncate leading-none pt-0.5">{link.label}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-admin-border/50 p-3 space-y-1 shrink-0">
          <button
            onClick={toggleSidebarCollapse}
            className={`hidden lg:flex w-full items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-3 py-2 text-[14px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-surface-container hover:text-admin-text-primary`}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="h-[18px] w-[18px] shrink-0 text-admin-text-tertiary" />
            {!sidebarCollapsed && <span className="pt-0.5">Collapse</span>}
          </button>
          
          <button
            onClick={signOut}
            className={`flex w-full items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-3 py-2 text-[14px] font-medium text-admin-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500`}
            aria-label="Sign out"
            title={sidebarCollapsed ? "Sign out" : undefined}
          >
            <LogOut className={`h-[18px] w-[18px] shrink-0 ${sidebarCollapsed ? 'text-admin-text-tertiary hover:text-red-500' : ''}`} />
            {!sidebarCollapsed && <span className="pt-0.5">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-admin-surface-container">
        {/* Top Header */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-admin-border/50 bg-admin-surface px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-admin-text-secondary hover:bg-admin-surface-container lg:hidden outline-none focus-visible:ring-2 focus-visible:ring-admin-border"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden md:flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-admin-text-primary tracking-tight leading-tight">
                {getGreeting()}, {capitalizedName} 👋
              </h1>
              <p className="text-[13px] text-admin-text-tertiary leading-tight mt-1">
                Here's what's happening in Student Hub today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Premium Search */}
            <div className="hidden lg:flex items-center relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-admin-text-tertiary group-focus-within:text-admin-text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 rounded-full border border-admin-border/50 bg-admin-surface-container py-[7px] pl-[34px] pr-[54px] text-[13px] text-admin-text-primary placeholder:text-admin-text-tertiary focus:border-admin-border focus:bg-admin-surface focus:shadow-admin-sm focus:outline-none transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 opacity-60">
                <kbd className="font-sans text-[10px] font-medium border border-admin-border/50 rounded-md px-1.5 py-0.5 bg-admin-surface">Ctrl</kbd>
                <kbd className="font-sans text-[10px] font-medium border border-admin-border/50 rounded-md px-1.5 py-0.5 bg-admin-surface">K</kbd>
              </div>
            </div>

            <div className="h-5 w-px bg-admin-border/50 hidden sm:block mx-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 text-admin-text-tertiary hover:bg-admin-surface-container hover:text-admin-text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-admin-border"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
              
              <button
                className="relative rounded-full p-2 text-admin-text-tertiary hover:bg-admin-surface-container hover:text-admin-text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-admin-border"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2.5 h-1.5 w-1.5 rounded-full bg-admin-brand ring-2 ring-admin-surface" />
              </button>
            </div>

            {/* Profile */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-surface-container border border-admin-border/50 text-admin-text-primary text-[13px] font-semibold shadow-admin-sm outline-none hover:shadow-admin focus-visible:ring-2 focus-visible:ring-admin-brand focus-visible:ring-offset-2 transition-all ml-1">
              {capitalizedName.charAt(0)}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="p-6 lg:p-8 max-w-[1440px] mx-auto min-h-full flex flex-col gap-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
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

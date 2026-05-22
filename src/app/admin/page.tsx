'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  mockOpportunities,
  mockEvents,
  mockBlogs,
  mockResources,
} from '@/data/mock';
import {
  HiOutlineRocketLaunch,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
  HiOutlineBookOpen,
  HiOutlinePlusCircle,
  HiOutlineClock,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

/* ------------------------------------------------------------------ */
/*  Animated counter                                                  */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                         */
/* ------------------------------------------------------------------ */
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, color, gradient, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-tertiary">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary font-display">
            <AnimatedCounter target={value} />
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Activity                                                   */
/* ------------------------------------------------------------------ */
interface ActivityItem {
  type: string;
  title: string;
  date: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Quick Action Button                                               */
/* ------------------------------------------------------------------ */
interface QuickActionProps {
  label: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  delay: number;
}

function QuickAction({ label, href, icon: Icon, gradient, delay }: QuickActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-xl bg-gradient-to-r ${gradient} px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [oppCount, setOppCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Opportunities
    let opps = mockOpportunities;
    const oppsSaved = localStorage.getItem('sh_opportunities');
    if (oppsSaved) {
      try {
        opps = JSON.parse(oppsSaved);
      } catch (e) {}
    }

    // Events
    let evts = mockEvents;
    const evtsSaved = localStorage.getItem('sh_events');
    if (evtsSaved) {
      try {
        evts = JSON.parse(evtsSaved);
      } catch (e) {}
    }

    // Blogs
    let blgs = mockBlogs;
    const blgsSaved = localStorage.getItem('sh_blogs');
    if (blgsSaved) {
      try {
        blgs = JSON.parse(blgsSaved);
      } catch (e) {}
    }

    // Resources
    let rscs = mockResources;
    const rscsSaved = localStorage.getItem('sh_resources');
    if (rscsSaved) {
      try {
        rscs = JSON.parse(rscsSaved);
      } catch (e) {}
    }

    setOppCount(opps.length);
    setEventCount(evts.length);
    setBlogCount(blgs.length);
    setResourceCount(rscs.length);

    // Compute recent activities
    const items: ActivityItem[] = [
      ...opps.map((o) => ({
        type: 'Opportunity',
        title: o.title,
        date: o.createdAt,
        color: 'text-brand-teal',
      })),
      ...evts.map((e) => ({
        type: 'Event',
        title: e.title,
        date: e.createdAt,
        color: 'text-brand-amber',
      })),
      ...blgs.map((b) => ({
        type: 'Blog Post',
        title: b.title,
        date: b.createdAt,
        color: 'text-brand-blue',
      })),
      ...rscs.map((r) => ({
        type: 'Resource',
        title: r.title,
        date: r.createdAt,
        color: 'text-purple-500',
      })),
    ];
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(items.slice(0, 5));
  }, []);

  const stats = [
    {
      label: 'Total Opportunities',
      value: oppCount,
      icon: HiOutlineRocketLaunch,
      color: 'text-white',
      gradient: 'from-brand-teal to-brand-teal-dark',
      delay: 0,
    },
    {
      label: 'Total Events',
      value: eventCount,
      icon: HiOutlineCalendarDays,
      color: 'text-white',
      gradient: 'from-brand-amber to-brand-amber-dark',
      delay: 0.1,
    },
    {
      label: 'Blog Posts',
      value: blogCount,
      icon: HiOutlinePencilSquare,
      color: 'text-white',
      gradient: 'from-brand-blue to-brand-blue-dark',
      delay: 0.2,
    },
    {
      label: 'Resources',
      value: resourceCount,
      icon: HiOutlineBookOpen,
      color: 'text-white',
      gradient: 'from-purple-500 to-purple-700',
      delay: 0.3,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-text-primary font-display sm:text-3xl"
        >
          Dashboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-sm text-text-tertiary"
        >
          Welcome back! Here&apos;s an overview of your community.
        </motion.p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <div className="mb-5 flex items-center gap-2">
            <HiOutlineClock className="h-5 w-5 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text-primary font-display">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div
                key={`${item.type}-${item.title}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 rounded-xl border border-border-light p-4 transition-colors hover:bg-surface-container/50"
              >
                <div className="flex h-2 w-2 shrink-0 rounded-full">
                  <span className={`h-2 w-2 rounded-full ${item.color === 'text-brand-teal' ? 'bg-brand-teal' : item.color === 'text-brand-amber' ? 'bg-brand-amber' : item.color === 'text-brand-blue' ? 'bg-brand-blue' : 'bg-purple-500'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {item.type}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text-tertiary">
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <HiOutlineArrowTrendingUp className="h-5 w-5 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text-primary font-display">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <QuickAction
              label="Add Opportunity"
              href="/admin/opportunities"
              icon={HiOutlinePlusCircle}
              gradient="from-brand-teal to-brand-teal-dark"
              delay={0.6}
            />
            <QuickAction
              label="Add Event"
              href="/admin/events"
              icon={HiOutlinePlusCircle}
              gradient="from-brand-amber-dark to-brand-amber"
              delay={0.7}
            />
            <QuickAction
              label="Write Blog"
              href="/admin/blog"
              icon={HiOutlinePlusCircle}
              gradient="from-brand-blue to-brand-blue-dark"
              delay={0.8}
            />
            <QuickAction
              label="Add Resource"
              href="/admin/resources"
              icon={HiOutlinePlusCircle}
              gradient="from-purple-500 to-purple-700"
              delay={0.9}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

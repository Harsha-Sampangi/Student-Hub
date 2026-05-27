'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  mockOpportunities,
  mockEvents,
  mockBlogs,
  mockResources,
  mockTeam,
} from '@/data/mock';
import { fetchCollection } from '@/lib/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Opportunity, Event as HubEvent, BlogPost, Resource } from '@/types';
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
  const [isConfigured, setIsConfigured] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setIsConfigured(isFirebaseConfigured());

    const loadDashboardData = async () => {
      try {
        const opps = await fetchCollection<Opportunity>('opportunities');
        const evts = await fetchCollection<HubEvent>('events');
        const blgs = await fetchCollection<BlogPost>('blogs');
        const rscs = await fetchCollection<Resource>('resources');

        setOppCount(opps.length);
        setEventCount(evts.length);
        setBlogCount(blgs.length);
        setResourceCount(rscs.length);

        // Compute recent activities
        const items: ActivityItem[] = [
          ...opps.map((o) => ({
            type: 'Opportunity',
            title: o.title,
            date: o.createdAt || new Date().toISOString(),
            color: 'text-brand-teal',
          })),
          ...evts.map((e) => ({
            type: 'Event',
            title: e.title,
            date: e.createdAt || new Date().toISOString(),
            color: 'text-brand-amber',
          })),
          ...blgs.map((b) => ({
            type: 'Blog Post',
            title: b.title,
            date: b.createdAt || new Date().toISOString(),
            color: 'text-brand-blue',
          })),
          ...rscs.map((r) => ({
            type: 'Resource',
            title: r.title,
            date: r.createdAt || new Date().toISOString(),
            color: 'text-purple-500',
          })),
        ];
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivity(items.slice(0, 5));
      } catch (e) {
        console.error('Failed to load dashboard metrics:', e);
      }
    };
    loadDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!confirm('Are you sure you want to seed the Firestore database with initial mock data? This will add mock items to your live collections.')) {
      return;
    }
    setSeeding(true);
    try {
      // 1. Seed opportunities
      for (const opp of mockOpportunities) {
        const { id, ...data } = opp;
        await addDoc(collection(db, 'opportunities'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      
      // 2. Seed events
      for (const evt of mockEvents) {
        const { id, ...data } = evt;
        await addDoc(collection(db, 'events'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      
      // 3. Seed blogs
      for (const blog of mockBlogs) {
        const { id, ...data } = blog;
        await addDoc(collection(db, 'blogs'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      
      // 4. Seed resources
      for (const res of mockResources) {
        const { id, ...data } = res;
        await addDoc(collection(db, 'resources'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      // 5. Seed team
      for (const t of mockTeam) {
        const { id, ...data } = t;
        await addDoc(collection(db, 'team'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      alert('Database seeded successfully! All mock opportunities, events, blogs, resources, and team members have been uploaded to Firestore.');
      window.location.reload();
    } catch (e: any) {
      console.error('Failed to seed database:', e);
      alert(`Failed to seed database: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="mt-1 text-sm text-text-tertiary flex items-center gap-2"
          >
            Status:{' '}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isConfigured ? 'bg-green-500/10 text-green-500' : 'bg-brand-amber/10 text-brand-amber'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isConfigured ? 'bg-green-500 animate-pulse' : 'bg-brand-amber'}`} />
              {isConfigured ? 'Connected to Firestore' : 'LocalStorage Fallback'}
            </span>
          </motion.p>
        </div>

        {isConfigured && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {seeding ? 'Seeding Firestore...' : 'Seed Firestore DB'}
          </motion.button>
        )}
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

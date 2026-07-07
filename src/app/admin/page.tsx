'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Calendar,
  PenTool,
  BookOpen,
  ArrowUpRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { fetchCollection } from '@/lib/firestore';
import { isFirebaseConfigured } from '@/lib/firebase';
import type { Opportunity, Event as HubEvent, BlogPost, Resource } from '@/types';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminKPICard } from '@/components/admin/AdminKPICard';

interface ActivityItem {
  type: string;
  title: string;
  date: string;
  color: string;
  icon: any;
}

// Dummy data for charts
const visitorData = [
  { name: 'Mon', visitors: 1200 },
  { name: 'Tue', visitors: 1800 },
  { name: 'Wed', visitors: 1500 },
  { name: 'Thu', visitors: 2200 },
  { name: 'Fri', visitors: 2800 },
  { name: 'Sat', visitors: 3500 },
  { name: 'Sun', visitors: 3100 },
];

const categoryData = [
  { name: 'Hackathons', count: 45 },
  { name: 'Internships', count: 85 },
  { name: 'Workshops', count: 35 },
  { name: 'Open Source', count: 55 },
];

export default function AdminDashboardPage() {
  const [oppCount, setOppCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);

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

        const items: ActivityItem[] = [
          ...opps.map((o) => ({
            type: 'Opportunity',
            title: o.title,
            date: o.createdAt || new Date().toISOString(),
            color: 'bg-emerald-500',
            icon: Rocket
          })),
          ...evts.map((e) => ({
            type: 'Event',
            title: e.title,
            date: e.createdAt || new Date().toISOString(),
            color: 'bg-amber-500',
            icon: Calendar
          })),
          ...blgs.map((b) => ({
            type: 'Blog Post',
            title: b.title,
            date: b.createdAt || new Date().toISOString(),
            color: 'bg-blue-500',
            icon: PenTool
          })),
          ...rscs.map((r) => ({
            type: 'Resource',
            title: r.title,
            date: r.createdAt || new Date().toISOString(),
            color: 'bg-purple-500',
            icon: BookOpen
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

  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) return 'Today';
    if (daysDifference === -1) return 'Yesterday';
    if (daysDifference > -7) return rtf.format(daysDifference, 'day');
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const quickActions = [
    { label: 'Create Opportunity', href: '/admin/opportunities', icon: Rocket, desc: 'Add a hackathon or internship', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Schedule Event', href: '/admin/events', icon: Calendar, desc: 'Plan an upcoming workshop', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Publish Blog', href: '/admin/blog', icon: PenTool, desc: 'Write a new community post', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Add Resource', href: '/admin/resources', icon: BookOpen, desc: 'Share tools and materials', gradient: 'from-purple-500 to-fuchsia-500' },
  ];

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 shrink-0">
        <AdminKPICard label="Total Opportunities" value={oppCount} icon={Rocket} trend="up" trendValue="+12.5%" trendLabel="from last month" delay={0} />
        <AdminKPICard label="Upcoming Events" value={eventCount} icon={Calendar} trend="up" trendValue="+5.2%" trendLabel="from last month" delay={0.1} />
        <AdminKPICard label="Published Blogs" value={blogCount} icon={PenTool} trend="neutral" trendValue="0.0%" trendLabel="from last month" delay={0.2} />
        <AdminKPICard label="Active Resources" value={resourceCount} icon={BookOpen} trend="up" trendValue="+24.1%" trendLabel="from last month" delay={0.3} />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        <AdminCard title="Website Visitors" className="lg:col-span-2 h-[360px]" noPadding>
          <div className="p-6 h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-brand)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--admin-brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--admin-text-tertiary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--admin-text-tertiary)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--admin-surface)', borderRadius: '8px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-md)' }}
                  itemStyle={{ color: 'var(--admin-text-primary)' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="var(--admin-brand)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        
        <AdminCard title="Opportunities Breakdown" className="h-[360px]" noPadding>
          <div className="p-6 h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--admin-border)" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--admin-text-secondary)' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'var(--admin-surface-container)' }}
                  contentStyle={{ backgroundColor: 'var(--admin-surface)', borderRadius: '8px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-md)' }}
                />
                <Bar dataKey="count" fill="var(--admin-brand)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Recent Activity Timeline */}
        <AdminCard title="Recent Activity" className="h-full">
          <div className="relative pl-6">
            {/* Timeline Line */}
            <div className="absolute left-[31px] top-6 bottom-4 w-[2px] bg-admin-border/50 rounded-full" />
            
            <div className="space-y-6">
              {recentActivity.map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={`${item.type}-${item.title}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    className="relative flex items-start gap-5 group"
                  >
                    {/* Icon Node */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-admin-surface border-[3px] border-admin-surface shadow-admin-sm transition-transform group-hover:scale-110">
                      <div className={`flex h-full w-full items-center justify-center rounded-full text-white ${item.color}`}>
                        <ItemIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-4 border-b border-admin-border/50 group-last:border-0 pt-2">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[15px] font-semibold text-admin-text-primary tracking-tight transition-colors group-hover:text-admin-brand">
                          {item.title}
                        </p>
                        <span className="shrink-0 text-[13px] font-medium text-admin-text-tertiary">
                          {getRelativeTime(item.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-admin-text-secondary">
                        New {item.type} created
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              
              {recentActivity.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-admin-surface-container flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-admin-text-tertiary" />
                  </div>
                  <p className="text-[14px] font-medium text-admin-text-secondary">No recent activity</p>
                  <p className="text-[13px] text-admin-text-tertiary">Create your first item to see it here.</p>
                </div>
              )}
            </div>
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <AdminCard title="Quick Actions" className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="group relative flex flex-col items-start gap-4 rounded-admin-lg border border-admin-border/50 bg-admin-surface p-5 transition-all duration-300 hover:shadow-admin-md hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.gradient} opacity-[0.03] rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-10`} />
                  
                  <div className="flex w-full items-start justify-between">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${action.gradient} text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-surface-container text-admin-text-tertiary transition-colors group-hover:bg-admin-brand-light group-hover:text-admin-brand">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-[15px] font-semibold text-admin-text-primary tracking-tight">
                      {action.label}
                    </p>
                    <p className="text-[13px] text-admin-text-secondary mt-1">
                      {action.desc}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* Footer Database Status Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between rounded-admin-md border border-admin-border/50 bg-admin-surface px-5 py-3.5 shadow-admin-sm shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${isConfigured ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            <Database className={`h-4 w-4 ${isConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-admin-surface ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-admin-text-primary leading-tight">
              {isConfigured ? 'Connected to Firebase' : 'Local Storage Fallback'}
            </p>
            <p className="text-[11px] font-medium text-admin-text-tertiary mt-0.5">
              Last synced: Just now
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

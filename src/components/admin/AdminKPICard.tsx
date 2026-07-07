import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Reuse the existing animated counter logic
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
            const eased = 1 - Math.pow(1 - progress, 3);
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

interface AdminKPICardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
  delay?: number;
}

export function AdminKPICard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  delay = 0,
}: AdminKPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-admin-surface rounded-admin-xl border border-admin-border/50 p-6 shadow-admin-sm transition-all duration-300 hover:shadow-admin-md relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-admin-brand/[0.03] transition-transform duration-500 group-hover:scale-150" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-admin-surface-container border border-admin-border/50 text-admin-text-primary shadow-admin-sm group-hover:bg-admin-brand group-hover:text-white transition-colors duration-300">
          <Icon className="h-5 w-5" />
        </div>
        
        {(trend || trendValue) && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium border ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
            trend === 'down' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
            'bg-admin-surface-container text-admin-text-secondary border-admin-border/50'
          }`}>
            {trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
            {trend === 'neutral' && <Minus className="h-3.5 w-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[14px] font-medium text-admin-text-secondary mb-1 tracking-tight">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-[36px] font-bold text-admin-text-primary tracking-tighter leading-none">
            <AnimatedCounter target={value} />
          </h4>
        </div>
      </div>
      
      {trendLabel && (
        <p className="mt-4 text-[13px] text-admin-text-tertiary relative z-10">
          {trendLabel}
        </p>
      )}
    </motion.div>
  );
}

import { ReactNode } from 'react';
import { Terminal, Briefcase, Users, Code, Trophy, GraduationCap, Box } from 'lucide-react';

export type BadgeCategory = 'Hackathon' | 'Internship' | 'Workshop' | 'Open Source' | 'Contest' | 'Scholarship' | string;

interface AdminBadgeProps {
  category: BadgeCategory;
  className?: string;
}

const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case 'hackathon':
      return { color: 'bg-teal-500/10 text-teal-600 border-teal-500/20', icon: Terminal };
    case 'internship':
      return { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Briefcase };
    case 'workshop':
      return { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Users };
    case 'open source':
      return { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: Code };
    case 'contest':
      return { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Trophy };
    case 'scholarship':
      return { color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: GraduationCap };
    default:
      return { color: 'bg-admin-surface-container text-admin-text-secondary border-admin-border/50', icon: Box };
  }
};

export function AdminBadge({ category, className = '' }: AdminBadgeProps) {
  if (!category) return null;
  const { color, icon: Icon } = getCategoryStyles(category);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border ${color} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{category}</span>
    </div>
  );
}

export type StatusType = 'Active' | 'Draft' | 'Closed' | 'Expired' | string;

interface AdminStatusBadgeProps {
  status: StatusType;
  className?: string;
}

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase();
  
  if (normalized === 'active' || normalized === 'published' || normalized === 'open') {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      pulse: 'bg-emerald-500 animate-pulse'
    };
  }
  
  if (normalized === 'draft' || normalized === 'pending') {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
      pulse: ''
    };
  }

  if (normalized === 'closed' || normalized === 'expired' || normalized === 'inactive') {
    return {
      bg: 'bg-admin-surface-container',
      text: 'text-admin-text-secondary',
      border: 'border-admin-border/50',
      dot: 'bg-admin-text-tertiary',
      pulse: ''
    };
  }

  return {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
    pulse: ''
  };
};

export function AdminStatusBadge({ status, className = '' }: AdminStatusBadgeProps) {
  if (!status) return null;
  const styles = getStatusStyles(status);

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[12px] font-medium border ${styles.bg} ${styles.text} ${styles.border} ${className}`}>
      <div className="relative flex h-2 w-2 items-center justify-center">
        <span className={`absolute h-2 w-2 rounded-full ${styles.dot}`} />
        {styles.pulse && <span className={`absolute h-2.5 w-2.5 rounded-full opacity-75 ${styles.pulse}`} />}
      </div>
      <span>{status}</span>
    </div>
  );
}

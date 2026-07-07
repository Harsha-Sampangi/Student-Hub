import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function AdminButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: AdminButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-admin-brand text-white hover:bg-admin-brand-hover shadow-admin-sm focus-visible:ring-admin-brand/50',
    secondary: 'bg-admin-surface text-admin-text-primary border border-admin-border hover:bg-admin-surface-container shadow-admin-sm focus-visible:ring-admin-border',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-admin-sm focus-visible:ring-red-500/50',
    ghost: 'text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface-container focus-visible:ring-admin-border',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-admin-md',
    md: 'text-sm px-4 py-2.5 rounded-admin-md',
    lg: 'text-base px-5 py-3 rounded-admin-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon}
      {children}
    </motion.button>
  );
}

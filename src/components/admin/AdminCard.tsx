import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  noPadding?: boolean;
}

export function AdminCard({ title, description, children, className = '', action, noPadding = false }: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-admin-surface rounded-admin-lg border border-admin-border/50 shadow-admin transition-shadow hover:shadow-admin-md overflow-hidden flex flex-col ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-5 border-b border-admin-border/50 flex items-center justify-between shrink-0">
          <div>
            {title && <h3 className="text-lg font-semibold text-admin-text-primary tracking-tight">{title}</h3>}
            {description && <p className="mt-1 text-sm text-admin-text-secondary">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </motion.div>
  );
}

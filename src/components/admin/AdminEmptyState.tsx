import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminEmptyState({ icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-admin-surface-container text-admin-text-tertiary mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-admin-text-primary font-display mb-2">{title}</h3>
      <p className="text-sm text-admin-text-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}

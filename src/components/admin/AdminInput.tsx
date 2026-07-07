import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-admin-text-tertiary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-admin border bg-admin-surface-container py-2.5 text-sm text-admin-text-primary placeholder:text-admin-text-tertiary focus:outline-none focus:ring-2 transition-all
              ${icon ? 'pl-10' : 'px-3.5'}
              ${error 
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500' 
                : 'border-admin-border focus:ring-admin-brand/30 focus:border-admin-brand'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';

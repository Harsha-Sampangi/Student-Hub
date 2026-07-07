import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
}

export function AdminTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyState
}: AdminTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div className="p-8">{emptyState}</div>;
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar rounded-admin-lg border border-admin-border/50 bg-admin-surface shadow-admin-sm">
      <table className="w-full text-left text-sm text-admin-text-secondary whitespace-nowrap border-collapse">
        <thead className="bg-admin-surface-container/80 sticky top-0 z-10 backdrop-blur-sm border-b border-admin-border/50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-4 font-semibold text-[13px] uppercase tracking-wider text-admin-text-tertiary ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-admin-border/30 last:border-0 transition-colors duration-200 ${
                onRowClick 
                  ? 'cursor-pointer hover:bg-admin-surface-container/50 hover:shadow-sm relative z-0 hover:z-10' 
                  : 'hover:bg-admin-surface-container/30'
              }`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 text-[14px] text-admin-text-primary ${col.className || ''}`}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as ReactNode)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

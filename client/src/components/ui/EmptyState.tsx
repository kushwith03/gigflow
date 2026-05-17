import { Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-transparent transition-colors">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-6 transition-colors shadow-inner">
        {icon || <Database size={32} />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
};

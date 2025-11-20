import React from 'react';
import { Calendar } from 'lucide-react';

const DateRangeFilter: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
        <button className="px-3 py-1.5 text-sm rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-white transition-colors font-medium">Hôm nay</button>
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">7 ngày</button>
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">30 ngày</button>
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors flex items-center gap-1">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            Tùy chỉnh
        </button>
    </div>
  );
};

export default DateRangeFilter;
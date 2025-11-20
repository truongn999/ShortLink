import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  showingText: string;
}

const Pagination: React.FC<PaginationProps> = ({ showingText }) => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-lg">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">{showingText}</span>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600 dark:text-neutral-300" disabled>
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-sm font-medium">1</button>
        <button className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">2</button>
        <button className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">3</button>
        <button className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
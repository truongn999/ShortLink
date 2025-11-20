import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trendValue?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  trendValue, 
  trendLabel, 
  trendDirection = 'up' 
}) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    red: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
        <div className={`w-9 h-9 ${currentStyle.bg} rounded-md flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${currentStyle.text}`} strokeWidth={1.5} />
        </div>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-1">{value}</div>
      {trendValue && (
        <div className="flex items-center gap-1 text-sm">
          {trendDirection === 'up' ? (
             <TrendingUp className={`w-3.5 h-3.5 ${trendValue.includes('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} strokeWidth={1.5} />
          ) : trendDirection === 'down' ? (
             <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" strokeWidth={1.5} />
          ) : null}
          
          <span className={`${
            trendDirection === 'down' || trendValue.includes('-') 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'
          } font-medium`}>{trendValue}</span>
          
          {trendLabel && (
            <span className="text-neutral-500 dark:text-neutral-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
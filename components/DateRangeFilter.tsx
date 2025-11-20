import React, { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';

interface DateRangeFilterProps {
  onRangeChange?: (range: { start: Date; end: Date; label: string }) => void;
  currentLabel?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  onRangeChange, 
  currentLabel = '7 ngày' 
}) => {
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePreset = (days: number | 'today') => {
    setShowCustomInputs(false);
    const end = new Date();
    const start = new Date();
    let label = '';

    if (days === 'today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      label = 'Hôm nay';
    } else {
      // For 7 days, we want today + previous 6 days
      start.setDate(end.getDate() - (days - 1));
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      label = `${days} ngày`;
    }

    if (onRangeChange) {
      onRangeChange({ start, end, label });
    }
  };

  const handleCustomSubmit = () => {
    if (!customStart || !customEnd) {
      setError('Vui lòng chọn cả ngày bắt đầu và kết thúc');
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);
    
    // Set proper time for inclusive range
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      setError('Ngày bắt đầu không thể lớn hơn ngày kết thúc');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 60) {
      setError('Khoảng thời gian tùy chỉnh tối đa là 60 ngày');
      return;
    }

    setError(null);
    setShowCustomInputs(false);
    
    if (onRangeChange) {
      onRangeChange({ 
        start, 
        end, 
        label: `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}` 
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => handlePreset('today')}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${
            currentLabel === 'Hôm nay' 
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white' 
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-white'
          }`}
        >
          Hôm nay
        </button>
        <button 
          onClick={() => handlePreset(7)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${
            currentLabel === '7 ngày' 
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white' 
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          7 ngày
        </button>
        <button 
          onClick={() => handlePreset(30)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${
            currentLabel === '30 ngày' 
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white' 
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          30 ngày
        </button>
        <button 
          onClick={() => setShowCustomInputs(!showCustomInputs)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors flex items-center gap-1 ${
             showCustomInputs || (!['Hôm nay', '7 ngày', '30 ngày'].includes(currentLabel))
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          <Calendar className="w-4 h-4" strokeWidth={1.5} />
          {(!['Hôm nay', '7 ngày', '30 ngày'].includes(currentLabel)) ? currentLabel : 'Tùy chỉnh'}
        </button>
      </div>

      {/* Custom Range Popover */}
      {showCustomInputs && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 w-full sm:w-80 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-3">
            <div>
               <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Ngày bắt đầu</label>
               <input 
                 type="date" 
                 value={customStart}
                 onChange={(e) => setCustomStart(e.target.value)}
                 className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Ngày kết thúc</label>
               <input 
                 type="date" 
                 value={customEnd}
                 onChange={(e) => setCustomEnd(e.target.value)}
                 className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
               />
            </div>
            
            {error && (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <span className="block">{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => { setShowCustomInputs(false); setError(null); }}
                className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                title="Hủy"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={handleCustomSubmit}
                className="flex items-center gap-1 px-3 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-md hover:opacity-90 transition-opacity"
              >
                <Check className="w-3.5 h-3.5" />
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
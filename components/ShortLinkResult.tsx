import React from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ShortLinkResultProps {
  shortCode: string;
  originalUrl: string;
}

const ShortLinkResult: React.FC<ShortLinkResultProps> = ({ shortCode, originalUrl }) => {
  const { showToast } = useToast();
  const domain = window.location.host;
  const shortUrl = `${domain}/${shortCode}`;
  const fullShortUrl = `${window.location.protocol}//${shortUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    showToast('Đã sao chép link vào clipboard!', 'success');
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">Link đã được tạo thành công!</h3>
        <p className="text-sm text-green-700 dark:text-green-300">Bạn có thể bắt đầu chia sẻ link ngay bây giờ.</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Short Link</div>
            <div className="flex items-center gap-2">
                <a href={fullShortUrl} target="_blank" rel="noreferrer" className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline truncate">
                {shortUrl}
                </a>
                <ExternalLink className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-md transition-colors"
            title="Sao chép"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Original URL</div>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 truncate" title={originalUrl}>
                {originalUrl}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShortLinkResult;

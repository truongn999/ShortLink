'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Copy, ExternalLink, QrCode, Download } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface ShortLinkResultProps {
  shortCode: string;
  originalUrl: string;
}

const ShortLinkResult: React.FC<ShortLinkResultProps> = ({ shortCode, originalUrl }) => {
  const { showToast } = useToast();
  const [domain, setDomain] = useState('');
  const [protocol, setProtocol] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.host);
      setProtocol(window.location.protocol);
    }
  }, []);

  const shortUrl = domain ? `${domain}/${shortCode}` : '';
  const fullShortUrl = protocol && shortUrl ? `${protocol}//${shortUrl}` : '';

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(fullShortUrl || shortUrl);
    showToast('Đã sao chép link vào clipboard!', 'success');
  };

  const handleDownloadQR = async () => {
    if (!fullShortUrl) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullShortUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qr_${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showToast('Đã tải mã QR về thiết bị!', 'success');
    } catch (err) {
      console.error('Failed to download QR code:', err);
      showToast('Không thể tải ảnh mã QR. Vui lòng thử lại sau.', 'error');
    }
  };

  if (!domain) return null; // Or a loading state

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

        {/* QR Code Section */}
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(fullShortUrl)}`}
                alt="QR Code"
                className="w-20 h-20 bg-white"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-neutral-500" />
                Mã QR Code
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[180px]">
                Quét để truy cập nhanh trên thiết bị di động.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadQR}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Tải QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortLinkResult;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertOctagon, Home, ArrowRight } from 'lucide-react';
import AdsBanner from '@/components/ui/AdsBanner';
import type { Link as DBLink } from '@/types';

interface RedirectClientProps {
  shortCode: string;
  initialLink?: DBLink;
}

export default function RedirectClient({ shortCode, initialLink }: RedirectClientProps) {
  const router = useRouter();
  const [error, setError] = useState<'NOT_FOUND' | 'INACTIVE' | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper nhận diện Browser
  const getBrowserName = (ua: string) => {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  // Helper nhận diện OS
  const getOSName = (ua: string) => {
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('like Mac')) return 'iOS';
    return 'Unknown';
  };

  useEffect(() => {
    const processRedirect = async () => {
      if (!shortCode) return;

      // Ngăn tracking nhiều lần cùng lượt truy cập
      const clickedKey = `clicked_${shortCode}`;
      if (typeof window !== 'undefined') {
          sessionStorage.setItem(clickedKey, '1');
      }

      try {
        let link = initialLink;

        // Nếu không có initialLink (fallback), tự fetch
        if (!link) {
            const { data, error: fetchError } = await supabase
            .from('links')
            .select('*')
            .eq('short_code', shortCode)
            .single();

            if (fetchError || !data) {
                setError('NOT_FOUND');
                setLoading(false);
                return;
            }
            link = data;
        }

        if (!link) return;

        const isExpired = link.expiration_date && new Date(link.expiration_date) < new Date();
        if (!link.is_active || isExpired) {
          setError('INACTIVE');
          setLoading(false);
          return;
        }

        // 2. Thu thập thông tin client
        const userAgent = navigator.userAgent;
        const referer = document.referrer;
        const width = window.innerWidth;
        const height = window.innerHeight;
        let deviceType = 'Desktop';
        if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
        else if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';

        // 3. Geo lookup (tùy chọn)
        interface GeoData {
          ip?: string;
          country_name?: string;
          city?: string;
        }
        let geoData: GeoData = {};
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 800);
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeout);
          if (res.ok) geoData = await res.json();
        } catch {}

        // 4. Ghi vào Supabase
        await Promise.all([
          // Cập nhật tổng clicks
          supabase
            .from('links')
            .update({
              clicks: (link.clicks || 0) + 1,
              last_clicked_at: new Date().toISOString(),
            })
            .eq('id', link.id),

          // Insert chi tiết click
          supabase.from('clicks').insert({
            link_id: link.id,
            ip_address: geoData.ip || null,
            country: geoData.country_name || null,
            city: geoData.city || null,
            user_agent: userAgent,
            referer: referer || null,
            device: deviceType,
            browser: getBrowserName(userAgent),
            os: getOSName(userAgent),
            viewport_width: width,
            viewport_height: height,
          }),
        ]);

        // 5. Redirect
        let destination = link.original_url;
        if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
          destination = 'https://' + destination;
        }
        window.location.href = destination;
      } catch (err) {
        console.error('Redirect error:', err);
        setError('NOT_FOUND');
        setLoading(false);
      }
    };

    processRedirect();
  }, [shortCode, initialLink]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Đang chuyển hướng đến trang đích...</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Vui lòng chờ trong giây lát</p>
          </div>

          {/* Ad Placement */}
          <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdsBanner
              size="medium-rectangle"
              label="Sponsored Link"
              className="shadow-sm"
              destinationUrl="#"
            />
          </div>

          <div className="text-xs text-neutral-400">Powered by ShortLink</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 px-4 transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <AlertOctagon className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {error === 'NOT_FOUND' ? 'Không tìm thấy liên kết' : 'Liên kết đã hết hạn'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {error === 'NOT_FOUND'
              ? 'Đường dẫn rút gọn bạn đang truy cập không tồn tại hoặc đã bị xóa.'
              : 'Đường dẫn này đã bị vô hiệu hóa hoặc hết hạn sử dụng.'}
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-md font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            Tạo link của bạn
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

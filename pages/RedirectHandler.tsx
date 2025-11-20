
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertOctagon, Home, ArrowRight } from 'lucide-react';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<'NOT_FOUND' | 'INACTIVE' | 'expired' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processRedirect = async () => {
      if (!shortCode) return;

      // 🔥 Ngăn insert 2 lần trong cùng 1 lượt truy cập
      const clickedKey = `clicked_${shortCode}`;
      if (sessionStorage.getItem(clickedKey)) {
        return; // đã tracking rồi → không chạy lại
      }
      sessionStorage.setItem(clickedKey, "1");

      try {
        // 1. Get original link info
        const { data: link, error: fetchError } = await supabase
          .from('links')
          .select('*')
          .eq('short_code', shortCode)
          .single();

        if (fetchError || !link) {
          setError('NOT_FOUND');
          setLoading(false);
          return;
        }

        if (!link.is_active) {
          setError('INACTIVE');
          setLoading(false);
          return;
        }

        // 2. Analytics
        const userAgent = navigator.userAgent;
        const referer = document.referrer;
        const width = window.innerWidth;
        const height = window.innerHeight;

        let deviceType = 'Desktop';
        if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
        else if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';

        // 3. Geo lookup (optional / timeout)
        let geoData: any = {};
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 800);
          const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
          clearTimeout(timeout);
          if (res.ok) geoData = await res.json();
        } catch {}

        // 4. Update DB
        await Promise.all([
          supabase.from('links')
            .update({
              clicks: (link.clicks || 0) + 1,
              last_clicked_at: new Date().toISOString()
            })
            .eq('id', link.id),
          
          supabase.from('clicks')
            .insert({
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
              viewport_height: height
            })
        ]);

        // 5. Redirect
        let destination = link.original_url;
        if (!destination.startsWith("http://") && !destination.startsWith("https://")) {
          destination = "https://" + destination;
        }
        window.location.href = destination;

      } catch (err) {
        console.error("Redirect logic error:", err);
        setError("NOT_FOUND");
        setLoading(false);
      }
    };

    processRedirect();
  }, [shortCode]);


  // Helper for Browser Name
  const getBrowserName = (ua: string) => {
      if (ua.indexOf("Chrome") > -1) return "Chrome";
      if (ua.indexOf("Safari") > -1) return "Safari";
      if (ua.indexOf("Firefox") > -1) return "Firefox";
      if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) return "IE";
      if (ua.indexOf("Edge") > -1) return "Edge";
      return "Unknown";
  };

  // Helper for OS Name
  const getOSName = (ua: string) => {
      if (ua.indexOf("Win") > -1) return "Windows";
      if (ua.indexOf("Mac") > -1) return "macOS";
      if (ua.indexOf("Linux") > -1) return "Linux";
      if (ua.indexOf("Android") > -1) return "Android";
      if (ua.indexOf("like Mac") > -1) return "iOS";
      return "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-neutral-900 dark:text-white" />
        <p className="text-lg font-medium animate-pulse">Đang chuyển hướng...</p>
        <p className="text-sm text-neutral-500 mt-2">Vui lòng đợi trong giây lát</p>
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
                    ? "Đường dẫn rút gọn bạn đang truy cập không tồn tại hoặc đã bị xóa."
                    : "Đường dẫn này đã bị vô hiệu hóa bởi người tạo hoặc đã hết hạn sử dụng."
                }
            </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Về trang chủ
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-md font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                Tạo link của bạn
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RedirectHandler;

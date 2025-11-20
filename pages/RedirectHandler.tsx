import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertOctagon, Home, ArrowRight } from 'lucide-react';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<'NOT_FOUND' | 'INACTIVE' | 'expired' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) return;

      try {
        // 1. Fetch the link details
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

        // Check expiration if implemented in future
        // if (link.expiration_date && new Date(link.expiration_date) < new Date()) ...

        // 2. Async Click Tracking (Don't await strictly to speed up redirect)
        trackClick(link.id);

        // 3. Redirect
        // Add http/https if missing (though validation on create should handle this)
        let destination = link.original_url;
        if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
            destination = 'https://' + destination;
        }
        
        window.location.href = destination;

      } catch (err) {
        console.error("Redirect error:", err);
        setError('NOT_FOUND');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  const trackClick = async (linkId: string) => {
    try {
        // Basic info from browser
        const userAgent = navigator.userAgent;
        const referer = document.referrer;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Attempt to get Geo/IP info (Optional: relying on a free public API)
        // Note: In a production environment, this is better handled by Supabase Edge Functions 
        // to prevent ad-blockers from blocking the tracking request or API limits.
        let geoData: any = {};
        try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
                geoData = await res.json();
            }
        } catch (e) {
            // Silently fail geo lookup to not block tracking
            console.warn('Could not fetch geo data');
        }

        // Determine simple device type
        let deviceType = 'Desktop';
        if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
        else if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';

        // Prepare payload matching the 'clicks' table schema
        const clickPayload = {
            link_id: linkId,
            user_agent: userAgent,
            referer: referer || null,
            ip_address: geoData.ip || null,
            country: geoData.country_name || null,
            city: geoData.city || null,
            device: deviceType,
            browser: getBrowserName(userAgent),
            os: getOSName(userAgent),
            viewport_width: width,
            viewport_height: height
        };

        await supabase.from('clicks').insert(clickPayload);

        // Increment the click counter on the link itself (Optional, if using a trigger this isn't needed, 
        // but good for immediate UI updates if not using triggers)
        await supabase.rpc('increment_clicks', { link_id: linkId }); // Assuming an RPC exists, or use update
        // Fallback update if no RPC
        // await supabase.from('links').update({ clicks: link.clicks + 1 }).eq('id', linkId);

    } catch (err) {
        console.error('Failed to track click:', err);
    }
  };

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
        <p className="text-lg font-medium animate-pulse">Redirecting...</p>
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
                {error === 'NOT_FOUND' ? 'Link Not Found' : 'Link Inactive'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
                {error === 'NOT_FOUND' 
                    ? "The short link you are trying to access does not exist or has been deleted."
                    : "This link has been disabled by the owner or has expired."
                }
            </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Go to Homepage
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-md font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                Create your own Link
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RedirectHandler;
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Link2, 
  BarChart3, 
  QrCode, 
  CalendarClock, 
  Shield, 
  Code, 
  Copy, 
  CheckCircle, 
  Zap, 
  Loader2, 
  AlertCircle,
  Layout,
  Smartphone,
  Globe,
  ArrowRight,
  Check,
  ClipboardPaste
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import AdsBanner from '@/components/ui/AdsBanner';
import PublicLayout from '@/components/layout/PublicLayout';
import type { Link as DBLink } from '@/types';
import ShortLinkResult from '@/components/features/links/ShortLinkResult';

export default function LandingPageClient() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [createdLink, setCreatedLink] = useState<{ shortCode: string; originalUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host);
    }
  }, []);

  const handleShorten = async () => {
    if (!url) return;
    
    // Basic URL validation
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }

    setLoading(true);
    setError(null);
    setCreatedLink(null);

    try {
      // 1. Fetch unique shortcode from DB function
      const { data: generatedSlug, error: rpcError } = await supabase.rpc('generate_unique_short_code');
      if (rpcError) throw rpcError;
      
      // Payload preparation
      const payload: Partial<DBLink> = {
        original_url: finalUrl,
        short_code: generatedSlug,
        is_active: true,
        // If user exists, save user_id. If not, send null (requires DB to allow NULL user_id)
        user_id: user ? user.id : null 
      };

      const { error: insertError } = await supabase
        .from('links')
        .insert(payload);

      if (insertError) throw insertError;

      setCreatedLink({
        shortCode: generatedSlug,
        originalUrl: finalUrl
      });
      
    } catch (err: any) {
      console.error('Error creating link:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tạo link.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      // Check if clipboard API is supported
      if (!navigator.clipboard || !navigator.clipboard.readText) {
          throw new Error('Trình duyệt không hỗ trợ API bộ nhớ tạm');
      }
      
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError('Trình duyệt đã chặn truy cập bộ nhớ tạm. Vui lòng dán thủ công (Ctrl+V).');
      // Focus the input for better UX
      const input = document.getElementById('url-input');
      if (input) input.focus();
    }
  };

  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Rút gọn Link Miễn phí
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
            Tạo các link rút gọn chuyên nghiệp, theo dõi phân tích chi tiết và tối ưu hóa các chiến dịch của bạn một cách dễ dàng.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 max-w-2xl mx-auto shadow-sm transition-colors">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Dán link của bạn vào đây..."
                  className="w-full pl-11 pr-12 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-base"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-all"
                  title="Dán từ bộ nhớ tạm"
                >
                  <ClipboardPaste className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <button 
                onClick={handleShorten} 
                disabled={loading || !url}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Rút gọn ngay'}
              </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {createdLink && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                <ShortLinkResult 
                  shortCode={createdLink.shortCode} 
                  originalUrl={createdLink.originalUrl} 
                />
                {!user && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 text-center">
                        <Link href="/signup" className="text-neutral-900 dark:text-white font-medium hover:underline">Đăng ký</Link> để theo dõi thống kê và quản lý link vĩnh viễn.
                    </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 max-w-2xl mx-auto">
              <AdsBanner 
                size="responsive" 
                className="w-full h-20 sm:h-24 shadow-sm" 
                label="Được tài trợ"
              />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Miễn phí trọn đời</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Bảo mật cao</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Thống kê thời gian thực</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">Tính năng</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Mọi thứ bạn cần để quản lý link tiếp thị liên kết hiệu quả</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Link2, title: 'Slug tùy chỉnh', desc: 'Tùy chỉnh đường dẫn URL của bạn hoặc để chúng tôi tự tạo.' },
            { icon: BarChart3, title: 'Phân tích chi tiết', desc: 'Theo dõi lượt click, thiết bị, vị trí và nhiều hơn nữa.' },
            { icon: QrCode, title: 'Mã QR', desc: 'Tự động tạo mã QR cho mỗi link.' },
            { icon: CalendarClock, title: 'Ngày hết hạn', desc: 'Thiết lập ngày hết hạn và giới hạn lượt click.' },
            { icon: Shield, title: 'Bảo vệ khỏi Bot', desc: 'Tự động phát hiện và chặn lưu lượng truy cập giả mạo.' },
            { icon: Code, title: 'API cho nhà phát triển', desc: 'Tích hợp vào ứng dụng của bạn thông qua REST API.' },
          ].map((feature, idx) => (
            <div key={idx} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors hover:shadow-sm bg-white dark:bg-neutral-800">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-md flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-neutral-900 dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-base text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Capabilities Section */}
      <section id="dashboard-preview" className="bg-neutral-50 dark:bg-neutral-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
               <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                 Bảng điều khiển mạnh mẽ<br/> 
                 <span className="text-neutral-500 dark:text-neutral-400">Thông tin chi tiết trong tầm tay.</span>
               </h2>
               <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                 Đi sâu vào hành vi khán giả của bạn với bảng điều khiển phân tích toàn diện của chúng tôi. 
                 Hiểu rõ lưu lượng truy cập đến từ đâu, họ sử dụng thiết bị gì và link nào hoạt động tốt nhất.
               </p>
               <ul className="space-y-4">
                 {[
                   { text: 'Theo dõi lượt click và dữ liệu khách truy cập thời gian thực', icon: Zap },
                   { text: 'Phân tích vị trí địa lý & thiết bị', icon: Globe },
                   { text: 'Phân tích sản phẩm hiệu quả nhất', icon: BarChart3 },
                   { text: 'Xuất báo cáo dạng CSV/PDF', icon: Layout },
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                     <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" strokeWidth={2} />
                     </div>
                     {item.text}
                   </li>
                 ))}
               </ul>
               <div className="mt-8">
                 <Link href="/signup" className="inline-flex items-center gap-2 text-neutral-900 dark:text-white font-medium hover:underline">
                    Khám phá Bảng điều khiển <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>

            {/* Abstract Dashboard UI Visualization (Bento Grid) */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 rotate-1 hover:rotate-0 transition-transform duration-500">
               {/* Card 1: Total Clicks */}
               <div className="col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Tổng lượt click</div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">24.5K</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% so với tuần trước</div>
               </div>

               {/* Card 2: Devices */}
               <div className="col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Người dùng di động</div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">68%</div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-2">
                      <div className="h-full bg-purple-600 w-[68%] rounded-full"></div>
                  </div>
               </div>

               {/* Card 3: Chart Visual */}
               <div className="col-span-2 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 h-32 flex flex-col justify-between">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Xu hướng truy cập</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Trực tiếp</span>
                   </div>
                   <div className="flex items-end gap-1 h-16">
                       {[30, 50, 45, 70, 60, 85, 95, 65, 75, 90].map((h, i) => (
                           <div key={i} className="flex-1 bg-neutral-900 dark:bg-white opacity-80 rounded-t-sm hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                       ))}
                   </div>
               </div>

               {/* Card 4: Locations */}
               <div className="col-span-2 lg:col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Vị trí hàng đầu</div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between text-sm text-neutral-900 dark:text-white">
                          <span className="flex items-center gap-2">🇻🇳 Vietnam</span>
                          <span className="font-semibold">62%</span>
                      </div>
                      <div className="flex justify-between text-sm text-neutral-900 dark:text-white">
                          <span className="flex items-center gap-2">🇺🇸 USA</span>
                          <span className="font-semibold">15%</span>
                      </div>
                  </div>
               </div>

               {/* Card 5: Quick Actions */}
               <div className="col-span-2 lg:col-span-1 bg-neutral-900 dark:bg-white p-4 rounded-xl border border-neutral-900 dark:border-white text-white dark:text-neutral-900 flex flex-col justify-center items-center text-center">
                   <QrCode className="w-8 h-8 mb-2" />
                   <div className="font-bold">Tạo QR</div>
                   <div className="text-xs opacity-70">Tạo trong 1 cú nhấp</div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

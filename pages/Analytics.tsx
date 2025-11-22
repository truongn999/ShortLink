import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  Columns, 
  MousePointerClick, 
  Users, 
  Percent, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Link as LinkIcon, 
  Instagram, 
  Twitter, 
  ExternalLink, 
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Copy,
  Chrome,
  Globe2,
  Facebook,
  Youtube
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DateRangeFilter from '../components/DateRangeFilter';
import DataTable, { ColumnDef } from '../components/DataTable';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date()
  });
  const [dateLabel, setDateLabel] = useState('7 ngày');

  const handleDateRangeChange = ({ start, end, label }: { start: Date; end: Date; label: string }) => {
      setDateRange({ startDate: start, endDate: end });
      setDateLabel(label);
  };

  // Data State
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    ctr: 0,
    avgSession: '0s'
  });
  
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [browserData, setBrowserData] = useState<any[]>([]);
  const [osData, setOSData] = useState<any[]>([]);
  const [referrersData, setReferrersData] = useState<any[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<any[]>([]);
  const [linkPerformanceData, setLinkPerformanceData] = useState<any[]>([]);

  // Fetch Data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Clicks with related Links to filter by user
        const { data: clicks, error: clicksError } = await supabase
          .from('clicks')
          .select('*, links!inner(user_id, short_code, original_url, title)')
          .eq('links.user_id', user.id)
          .gte('created_at', dateRange.startDate.toISOString())
          .lte('created_at', dateRange.endDate.toISOString());

        if (clicksError) throw clicksError;

        // 2. Fetch Links for Performance Table
        const { data: links, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', user.id);

        if (linksError) throw linksError;

        processData(clicks || [], links || []);
      } catch (error: any) {
        console.error('Error fetching analytics:', error);
        showToast('Lỗi tải dữ liệu phân tích: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateRange]);

  const processData = (clicks: any[], links: any[]) => {
    // --- Global Stats ---
    const totalClicks = clicks.length;
    const uniqueVisitors = new Set(clicks.map(c => c.ip_address)).size;
    // Mock CTR & Avg Session (Not supported by DB yet)
    const ctr = totalClicks > 0 ? Math.round((uniqueVisitors / totalClicks) * 100) : 0; 

    setStats({
      totalClicks,
      uniqueVisitors,
      ctr,
      avgSession: 'N/A' // Placeholder
    });

    // --- Traffic Trend (Group by Date) ---
    const trafficMap = new Map();
    // Initialize last 7 days (or selected range) with 0
    let currentDate = new Date(dateRange.startDate);
    while (currentDate <= dateRange.endDate) {
        const dateStr = currentDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        trafficMap.set(dateStr, 0);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    clicks.forEach(click => {
        const dateStr = new Date(click.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (trafficMap.has(dateStr)) {
            trafficMap.set(dateStr, trafficMap.get(dateStr) + 1);
        }
    });

    const trafficChartData = Array.from(trafficMap.entries()).map(([name, clicks]) => ({ name, clicks }));
    setTrafficData(trafficChartData);

    // --- Geographic Distribution ---
    const countryMap = new Map();
    clicks.forEach(click => {
        const country = click.country || 'Unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    const sortedGeo = Array.from(countryMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({
            country,
            flag: getFlagEmoji(country),
            clicks: count,
            percent: Math.round((count / totalClicks) * 100),
            color: 'bg-blue-600' // Dynamic colors could be added
        }));
    setGeoData(sortedGeo);

    // --- Device Distribution ---
    const deviceMap = new Map();
    clicks.forEach(click => {
        const device = click.device || 'Desktop'; // Default to Desktop if null
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });
    const deviceChartData = Array.from(deviceMap.entries()).map(([name, value], index) => ({
        name,
        value,
        color: ['#3b82f6', '#22c55e', '#a855f7', '#f97316'][index % 4]
    }));
    setDeviceData(deviceChartData);

    // --- Browser Distribution ---
    const browserMap = new Map();
    clicks.forEach(click => {
        const browser = click.browser || 'Unknown';
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
    });
    const browserChartData = Array.from(browserMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
    setBrowserData(browserChartData);

    // --- OS Distribution ---
    const osMap = new Map();
    clicks.forEach(click => {
        const os = click.os || 'Unknown';
        osMap.set(os, (osMap.get(os) || 0) + 1);
    });
    const osChartData = Array.from(osMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
            name,
            percent: Math.round((value / totalClicks) * 100)
        }));
    setOSData(osChartData);

    // --- Referrers ---
    const refMap = new Map();
    clicks.forEach(click => {
        let ref = click.referer || 'Direct';
        try {
            if (ref !== 'Direct') {
                const url = new URL(ref);
                ref = url.hostname.replace('www.', '');
            }
        } catch (e) { ref = 'Direct'; }
        
        refMap.set(ref, (refMap.get(ref) || 0) + 1);
    });
    const refChartData = Array.from(refMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, clicks]) => ({
            name,
            clicks,
            percent: ((clicks / totalClicks) * 100).toFixed(1) + '%',
            type: getReferrerType(name),
            icon: getReferrerIcon(name)
        }));
    setReferrersData(refChartData);

    // --- Peak Hours ---
    const hoursMap = new Array(24).fill(0);
    clicks.forEach(click => {
        const hour = new Date(click.created_at).getHours();
        hoursMap[hour]++;
    });
    // Bin into 4-hour chunks for cleaner UI or keep hourly? 
    // Let's do simplified 4-hour blocks as per original UI design
    const peakData = [
        { time: '00:00', value: hoursMap.slice(0, 4).reduce((a, b) => a + b, 0) },
        { time: '04:00', value: hoursMap.slice(4, 8).reduce((a, b) => a + b, 0) },
        { time: '08:00', value: hoursMap.slice(8, 12).reduce((a, b) => a + b, 0) },
        { time: '12:00', value: hoursMap.slice(12, 16).reduce((a, b) => a + b, 0) },
        { time: '16:00', value: hoursMap.slice(16, 20).reduce((a, b) => a + b, 0) },
        { time: '20:00', value: hoursMap.slice(20, 24).reduce((a, b) => a + b, 0) },
    ];
    const maxPeak = Math.max(...peakData.map(d => d.value));
    const processedPeakData = peakData.map(d => ({
        ...d,
        width: maxPeak > 0 ? `${(d.value / maxPeak) * 100}%` : '0%',
        color: d.value === maxPeak && maxPeak > 0 ? 'bg-blue-600' : 'bg-neutral-900 dark:bg-white',
        textClass: d.value === maxPeak && maxPeak > 0 ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
    }));
    setPeakHoursData(processedPeakData);

    // --- Link Performance ---
    // Map clicks to links
    const linkStats = new Map();
    links.forEach(link => {
        linkStats.set(link.id, {
            ...link,
            clicks: 0,
            unique: 0,
            uniqueIPs: new Set()
        });
    });
    
    clicks.forEach(click => {
        if (linkStats.has(click.link_id)) {
            const stats = linkStats.get(click.link_id);
            stats.clicks++;
            stats.uniqueIPs.add(click.ip_address);
        }
    });

    const performanceData = Array.from(linkStats.values()).map(link => ({
        id: link.id,
        link: link.short_code,
        dest: link.original_url,
        clicks: link.clicks,
        unique: link.uniqueIPs.size,
        ctr: link.clicks > 0 ? ((link.uniqueIPs.size / link.clicks) * 100).toFixed(1) + '%' : '0%',
        created: new Date(link.created_at).toLocaleDateString('vi-VN'),
        status: link.is_active ? 'Active' : 'Paused',
        trend: 0, // Mock
        trendUp: true // Mock
    })).sort((a, b) => b.clicks - a.clicks); // Sort by clicks desc

    setLinkPerformanceData(performanceData);
  };

  // Helper Functions
  const getFlagEmoji = (countryCode: string) => {
      // Simple mock or mapping needed. For now return generic or code
      // In real app, use a library or proper mapping
      if (countryCode === 'VN' || countryCode === 'Vietnam') return '🇻🇳';
      if (countryCode === 'US' || countryCode === 'United States') return '🇺🇸';
      return '🌍';
  };

  const getReferrerType = (domain: string) => {
      if (domain.includes('facebook') || domain.includes('twitter') || domain.includes('instagram') || domain.includes('t.co')) return 'Social Media';
      if (domain.includes('google') || domain.includes('bing')) return 'Search Engine';
      if (domain === 'Direct') return 'Direct';
      return 'Referral';
  };

  const getReferrerIcon = (domain: string) => {
      if (domain.includes('facebook')) return Facebook;
      if (domain.includes('twitter') || domain.includes('t.co')) return Twitter;
      if (domain.includes('instagram')) return Instagram;
      if (domain.includes('youtube')) return Youtube;
      if (domain.includes('google')) return Search;
      if (domain === 'Direct') return LinkIcon;
      return Globe;
  };

  const handleCopyLink = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.host}/${text}`;
    navigator.clipboard.writeText(url);
    showToast('Link đã được sao chép!', 'success');
  };

  // --- Detailed View Component ---
  if (selectedLink) {
    return (
      <div className="animate-in fade-in slide-in-from-right duration-300">
        {/* Detail Header */}
        <div className="flex flex-col gap-6 mb-8">
          <button 
            onClick={() => setSelectedLink(null)}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại tổng quan
          </button>

          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedLink.link}</h1>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedLink.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'}`}>
                        {selectedLink.status}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="truncate max-w-md">{selectedLink.dest}</span>
                      <a href={selectedLink.dest} target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                      onClick={(e) => handleCopyLink(selectedLink.link, e)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
                   >
                      <Copy className="w-4 h-4" />
                      Copy Short Link
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors text-sm font-medium">
                      Edit Link
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                 <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total Clicks</div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedLink.clicks}</div>
                 </div>
                 <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Unique Visitors</div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedLink.unique}</div>
                 </div>
                 <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Click-through Rate</div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedLink.ctr}</div>
                 </div>
                 <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Date Created</div>
                    <div className="text-lg font-medium text-neutral-900 dark:text-white">{selectedLink.created}</div>
                 </div>
             </div>
          </div>
        </div>

        {/* Note: Detailed view charts would need to be filtered by specific link ID in a real app. 
            For now, we just show the global charts as a placeholder or we could filter the existing 'clicks' data if we passed it down.
            To keep it simple for this step, I'll reuse the global data but in a real scenario we'd refetch or filter.
        */}
        <div className="text-center py-12 text-neutral-500">
            Detailed analytics for specific links will be implemented in the next phase.
            <br/>
            (Currently showing global stats in the main view)
        </div>
      </div>
    );
  }

  // --- Global Overview View (Default) ---
  return (
    <div className="animate-in fade-in duration-300">
      {/* Analytics Header */}
      <PageHeader 
        title="Analytics Overview" 
        description="Phân tích chi tiết về hiệu suất links của bạn"
      >
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" style={{strokeWidth: 1.5}} />
            <input 
              type="text" 
              placeholder="Tìm link..." 
              className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
            />
        </div>
        <button className="border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" style={{strokeWidth: 1.5}} />
            Export
        </button>
      </PageHeader>

      {/* Date Range & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <DateRangeFilter 
            onRangeChange={handleDateRangeChange}
            currentLabel={dateLabel}
          /> 
          <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <Filter className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  Bộ lọc
                  <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-1.5 py-0.5 rounded">2</span>
              </button>
              <button className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <Columns className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  Cột
              </button>
          </div>
      </div>

      {loading ? (
          <div className="text-center py-20 text-neutral-500">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                  label="Tổng Clicks" 
                  value={stats.totalClicks} 
                  icon={MousePointerClick} 
                  color="blue" 
                  trendValue="+12.5%"
                  trendLabel="vs tuần trước"
                  trendDirection="up"
              />
              <StatsCard 
                  label="Unique Visitors" 
                  value={stats.uniqueVisitors} 
                  icon={Users} 
                  color="purple" 
                  trendValue="+8.3%"
                  trendLabel="vs tuần trước"
                  trendDirection="up"
              />
              <StatsCard 
                  label="CTR (Est.)" 
                  value={stats.ctr + '%'} 
                  icon={Percent} 
                  color="green" 
                  trendValue="-2.1%"
                  trendLabel="vs tuần trước"
                  trendDirection="down"
              />
              <StatsCard 
                  label="Avg. Session" 
                  value={stats.avgSession} 
                  icon={Clock} 
                  color="orange" 
                  trendValue="+0s"
                  trendLabel="vs tuần trước"
                  trendDirection="up"
              />
          </div>

          {/* Main Chart */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-8">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                 <div>
                     <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Traffic Overview</h3>
                     <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Tổng quan lưu lượng truy cập theo thời gian</p>
                 </div>
                 <div className="flex items-center gap-2">
                     <button className="px-3 py-1.5 text-xs rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium">Clicks</button>
                     <button className="px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">Unique</button>
                 </div>
             </div>

             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                         <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:opacity-20" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                      <Tooltip 
                         contentStyle={{backgroundColor: '#171717', border: 'none', borderRadius: '6px', color: '#fff'}}
                         itemStyle={{color: '#fff'}}
                      />
                      <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Geographic & Device Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
             {/* Geographic Distribution */}
             <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                 <div className="flex items-center justify-between mb-5">
                     <div>
                         <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Geographic Distribution</h3>
                         <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Top quốc gia theo lưu lượng</p>
                     </div>
                     <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
                         Xem tất cả
                         <ArrowRight className="w-4 h-4" style={{strokeWidth: 1.5}} />
                     </button>
                 </div>
                 <div className="space-y-3">
                     {geoData.length > 0 ? geoData.map((geo, idx) => (
                         <div key={idx} className={`flex items-center justify-between py-2.5 ${idx !== geoData.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-700' : ''}`}>
                             <div className="flex items-center gap-3 flex-1 min-w-0">
                                 <span className="text-2xl">{geo.flag}</span>
                                 <div className="flex-1 min-w-0">
                                     <div className="text-base font-medium text-neutral-900 dark:text-white">{geo.country}</div>
                                     <div className="text-xs text-neutral-500 dark:text-neutral-400">{geo.clicks} clicks</div>
                                 </div>
                             </div>
                             <div className="text-right ml-4">
                                 <div className="text-base font-semibold text-neutral-900 dark:text-white">{geo.percent}%</div>
                                 <div className="w-20 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full mt-1">
                                     <div className={`h-full rounded-full ${geo.color}`} style={{width: `${geo.percent}%`}}></div>
                                 </div>
                             </div>
                         </div>
                     )) : <div className="text-center py-8 text-neutral-500">Chưa có dữ liệu địa lý</div>}
                 </div>
             </div>

             {/* Device & Browser Stats */}
             <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                 <div className="flex items-center justify-between mb-5">
                     <div>
                         <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Device & Browser</h3>
                         <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Phân bố theo thiết bị và trình duyệt</p>
                     </div>
                 </div>

                 {/* Device Stats */}
                 <div className="space-y-4 mb-6">
                    {deviceData.length > 0 ? deviceData.map((device, idx) => (
                        <div key={idx}>
                             <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-2">
                                     <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                                         {device.name === 'Mobile' ? <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
                                          device.name === 'Tablet' ? <Tablet className="w-4 h-4 text-purple-600 dark:text-purple-400" /> :
                                          <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                     </div>
                                     <div>
                                         <div className="text-base font-medium text-neutral-900 dark:text-white">{device.name}</div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-base font-semibold text-neutral-900 dark:text-white">{device.value}</div>
                                 </div>
                             </div>
                             <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 rounded-full" style={{width: `${(device.value / stats.totalClicks) * 100}%`}}></div>
                             </div>
                        </div>
                    )) : <div className="text-center py-4 text-neutral-500">Chưa có dữ liệu thiết bị</div>}
                 </div>

                 {/* OS Distribution */}
                 <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                     <div className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Operating Systems</div>
                     <div className="grid grid-cols-2 gap-3">
                         {osData.map((os, idx) => (
                             <div key={idx} className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                                 <span className="text-sm text-neutral-600 dark:text-neutral-400">{os.name}</span>
                                 <span className="text-sm font-semibold text-neutral-900 dark:text-white">{os.percent}%</span>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
          </div>

          {/* Referrers & Peak Hours */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Top Referrers */}
              <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-5">
                      <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Referrers</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Nguồn traffic chính</p>
                      </div>
                      <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Xem tất cả</button>
                  </div>
                  <div className="space-y-1">
                      {referrersData.length > 0 ? referrersData.map((ref, idx) => (
                          <div key={idx} className="flex items-center justify-between py-3 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-700 rounded-md flex items-center justify-center flex-shrink-0">
                                      <ref.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" style={{strokeWidth: 1.5}} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="text-base font-medium text-neutral-900 dark:text-white truncate">{ref.name}</div>
                                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{ref.type}</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4 ml-4">
                                  <div className="text-right">
                                      <div className="text-base font-semibold text-neutral-900 dark:text-white">{ref.clicks}</div>
                                      <div className="text-xs text-neutral-500 dark:text-neutral-400">clicks</div>
                                  </div>
                                  <div className="text-sm font-medium text-neutral-900 dark:text-white w-12 text-right">{ref.percent}</div>
                              </div>
                          </div>
                      )) : <div className="text-center py-8 text-neutral-500">Chưa có dữ liệu nguồn truy cập</div>}
                  </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                  <div className="mb-5">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Peak Hours</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Giờ có lưu lượng cao nhất</p>
                  </div>
                  <div className="space-y-2">
                      {peakHoursData.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                              <div className="w-16 text-sm text-neutral-600 dark:text-neutral-400">{slot.time}</div>
                              <div className="flex-1 h-8 bg-neutral-100 dark:bg-neutral-700 rounded relative overflow-hidden">
                                  <div className={`absolute inset-y-0 left-0 rounded ${slot.color}`} style={{width: slot.width}}></div>
                                  <div className={`absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium ${slot.textClass}`}>{slot.value}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Link Performance Table */}
          <div className="mb-8">
              <DataTable 
                title="Link Performance"
                data={linkPerformanceData}
                columns={[
                  {
                    header: 'Link',
                    cell: (row) => (
                      <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{row.link}</span>
                          <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                              <ExternalLink className="w-4 h-4" style={{strokeWidth: 1.5}} />
                          </button>
                      </div>
                    )
                  },
                  {
                    header: 'Clicks',
                    accessorKey: 'clicks',
                    cell: (row) => <span className="text-base font-semibold text-neutral-900 dark:text-white">{row.clicks}</span>
                  },
                  {
                    header: 'Unique',
                    accessorKey: 'unique',
                    cell: (row) => <span className="text-base text-neutral-900 dark:text-white">{row.unique}</span>
                  },
                  {
                    header: 'CTR',
                    accessorKey: 'ctr',
                    cell: (row) => (
                      <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-neutral-900 dark:text-white">{row.ctr}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Avg Time',
                    cell: () => <span className="text-base text-neutral-900 dark:text-white">N/A</span>
                  },
                  {
                    header: 'Conversions',
                    cell: () => <span className="text-base font-medium text-neutral-900 dark:text-white">N/A</span>
                  },
                  {
                    header: 'Trend',
                    cell: () => (
                      <div className="flex items-center gap-1 h-8">
                          {/* Mock trend bars */}
                          <div className="w-1 h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                          <div className="w-1 h-4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
                          <div className="w-1 h-5 bg-neutral-400 dark:bg-neutral-500 rounded"></div>
                          <div className="w-1 h-6 bg-neutral-600 dark:bg-neutral-300 rounded"></div>
                          <div className="w-1 h-8 bg-green-600 dark:bg-green-500 rounded"></div>
                      </div>
                    )
                  }
                ]}
                onRowClick={(row) => setSelectedLink(row)}
                renderHeaderActions={() => (
                  <button className="px-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-900 dark:text-white flex items-center gap-1">
                      <SortDesc className="w-3.5 h-3.5" style={{strokeWidth: 1.5}} />
                      Sắp xếp
                  </button>
                )}
              />
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;

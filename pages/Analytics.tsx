import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DateRangeFilter from '../components/DateRangeFilter';
import Pagination from '../components/Pagination';

const Analytics: React.FC = () => {
  // Mock Data reflecting the HTML content
  const trafficData = [
    { name: 'T2', clicks: 112 },
    { name: 'T3', clicks: 154 },
    { name: 'T4', clicks: 135 },
    { name: 'T5', clicks: 218 },
    { name: 'T6', clicks: 272 },
    { name: 'T7', clicks: 304 },
    { name: 'CN', clicks: 176 },
  ];

  const geoData = [
    { country: 'Việt Nam', flag: '🇻🇳', clicks: '1,936', percent: 68, color: 'bg-blue-600' },
    { country: 'United States', flag: '🇺🇸', clicks: '427', percent: 15, color: 'bg-green-600' },
    { country: 'Thailand', flag: '🇹🇭', clicks: '199', percent: 7, color: 'bg-purple-600' },
    { country: 'Singapore', flag: '🇸🇬', clicks: '171', percent: 6, color: 'bg-orange-600' },
    { country: 'Japan', flag: '🇯🇵', clicks: '114', percent: 4, color: 'bg-pink-600' },
  ];

  const referrersData = [
    { icon: Globe, name: 'facebook.com', type: 'Social Media', clicks: '847', percent: '29.8%' },
    { icon: Search, name: 'google.com', type: 'Search Engine', clicks: '624', percent: '21.9%' },
    { icon: LinkIcon, name: 'Direct Traffic', type: 'Direct', clicks: '512', percent: '18.0%' },
    { icon: Instagram, name: 'instagram.com', type: 'Social Media', clicks: '398', percent: '14.0%' },
    { icon: Twitter, name: 'twitter.com', type: 'Social Media', clicks: '283', percent: '9.9%' },
  ];

  const peakHoursData = [
    { time: '00:00', value: 48, width: '15%', color: 'bg-neutral-900 dark:bg-white', textClass: 'text-neutral-600 dark:text-neutral-300' },
    { time: '04:00', value: 25, width: '8%', color: 'bg-neutral-900 dark:bg-white', textClass: 'text-neutral-600 dark:text-neutral-300' },
    { time: '08:00', value: 198, width: '62%', color: 'bg-neutral-900 dark:bg-white', textClass: 'text-neutral-600 dark:text-neutral-300' },
    { time: '12:00', value: 304, width: '95%', color: 'bg-blue-600', textClass: 'text-white' },
    { time: '16:00', value: 249, width: '78%', color: 'bg-neutral-900 dark:bg-white', textClass: 'text-neutral-600 dark:text-neutral-300' },
    { time: '20:00', value: 272, width: '85%', color: 'bg-green-600', textClass: 'text-white' },
  ];

  const linkPerformanceData = [
    { link: 'linkshort.vn/spx2024', dest: 'https://shope.ee/5VxKLongAffiliateLink...', platform: 'Shopee', clicks: '1,247', created: '15/01/2024', status: 'Active', trend: 12, trendUp: true },
    { link: 'linkshort.vn/tiki-sale', dest: 'https://tiki.vn/product-abc?aff=xyz123...', platform: 'Tiki', clicks: '892', created: '12/01/2024', status: 'Active', trend: 8, trendUp: true },
    { link: 'linkshort.vn/lazada-11', dest: 'https://lazada.vn/products/i123456.html...', platform: 'Lazada', clicks: '456', created: '08/01/2024', status: 'Paused', trend: 3, trendUp: false },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Analytics Header */}
      <PageHeader 
        title="Analytics" 
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
          <DateRangeFilter />
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
              label="Tổng Clicks" 
              value="2,847" 
              icon={MousePointerClick} 
              color="blue" 
              trendValue="+12.5%"
              trendLabel="vs tuần trước"
              trendDirection="up"
          />
          <StatsCard 
              label="Unique Visitors" 
              value="1,924" 
              icon={Users} 
              color="purple" 
              trendValue="+8.3%"
              trendLabel="vs tuần trước"
              trendDirection="up"
          />
          <StatsCard 
              label="CTR Average" 
              value="67.6%" 
              icon={Percent} 
              color="green" 
              trendValue="-2.1%"
              trendLabel="vs tuần trước"
              trendDirection="down"
          />
          <StatsCard 
              label="Avg. Session" 
              value="2m 34s" 
              icon={Clock} 
              color="orange" 
              trendValue="+18s"
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
                 <button className="px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">Conversions</button>
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
                     <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Top 10 quốc gia theo lưu lượng</p>
                 </div>
                 <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
                     Xem tất cả
                     <ArrowRight className="w-4 h-4" style={{strokeWidth: 1.5}} />
                 </button>
             </div>
             <div className="space-y-3">
                 {geoData.map((geo, idx) => (
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
                 ))}
             </div>
         </div>

         {/* Device & Browser Stats */}
         <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
             <div className="flex items-center justify-between mb-5">
                 <div>
                     <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Device & Browser</h3>
                     <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Phân bố theo thiết bị và trình duyệt</p>
                 </div>
                 <div className="flex items-center gap-2">
                     <button className="px-2.5 py-1 text-xs rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium">Device</button>
                     <button className="px-2.5 py-1 text-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400">Browser</button>
                 </div>
             </div>

             {/* Device Stats */}
             <div className="space-y-4 mb-6">
                 <div>
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                                 <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" style={{strokeWidth: 1.5}} />
                             </div>
                             <div>
                                 <div className="text-base font-medium text-neutral-900 dark:text-white">Mobile</div>
                                 <div className="text-xs text-neutral-500 dark:text-neutral-400">iOS & Android</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-base font-semibold text-neutral-900 dark:text-white">1,892</div>
                             <div className="text-xs text-neutral-500 dark:text-neutral-400">66.5%</div>
                         </div>
                     </div>
                     <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 rounded-full" style={{width: '66.5%'}}></div>
                     </div>
                 </div>

                 <div>
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <div className="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                                 <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} />
                             </div>
                             <div>
                                 <div className="text-base font-medium text-neutral-900 dark:text-white">Desktop</div>
                                 <div className="text-xs text-neutral-500 dark:text-neutral-400">Windows & Mac</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-base font-semibold text-neutral-900 dark:text-white">768</div>
                             <div className="text-xs text-neutral-500 dark:text-neutral-400">27.0%</div>
                         </div>
                     </div>
                     <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                         <div className="h-full bg-green-600 rounded-full" style={{width: '27%'}}></div>
                     </div>
                 </div>

                 <div>
                     <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <div className="w-9 h-9 bg-purple-50 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                                 <Tablet className="w-4 h-4 text-purple-600 dark:text-purple-400" style={{strokeWidth: 1.5}} />
                             </div>
                             <div>
                                 <div className="text-base font-medium text-neutral-900 dark:text-white">Tablet</div>
                                 <div className="text-xs text-neutral-500 dark:text-neutral-400">iPad & Android</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-base font-semibold text-neutral-900 dark:text-white">187</div>
                             <div className="text-xs text-neutral-500 dark:text-neutral-400">6.5%</div>
                         </div>
                     </div>
                     <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-600 rounded-full" style={{width: '6.5%'}}></div>
                     </div>
                 </div>
             </div>

             {/* OS Distribution */}
             <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                 <div className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Operating Systems</div>
                 <div className="grid grid-cols-2 gap-3">
                     <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                         <span className="text-sm text-neutral-600 dark:text-neutral-400">iOS</span>
                         <span className="text-sm font-semibold text-neutral-900 dark:text-white">42%</span>
                     </div>
                     <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                         <span className="text-sm text-neutral-600 dark:text-neutral-400">Android</span>
                         <span className="text-sm font-semibold text-neutral-900 dark:text-white">31%</span>
                     </div>
                     <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                         <span className="text-sm text-neutral-600 dark:text-neutral-400">Windows</span>
                         <span className="text-sm font-semibold text-neutral-900 dark:text-white">18%</span>
                     </div>
                     <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                         <span className="text-sm text-neutral-600 dark:text-neutral-400">macOS</span>
                         <span className="text-sm font-semibold text-neutral-900 dark:text-white">9%</span>
                     </div>
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
                  {referrersData.map((ref, idx) => (
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
                  ))}
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
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Giờ cao điểm</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">12:00 - 13:00</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Link Performance Table */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900 dark:text-white">Link Performance</h2>
              <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-900 dark:text-white flex items-center gap-1">
                      <SortDesc className="w-3.5 h-3.5" style={{strokeWidth: 1.5}} />
                      Sắp xếp
                  </button>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Link</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Clicks</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Unique</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">CTR</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Avg Time</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Conversions</th>
                          <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Trend</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-800">
                      {linkPerformanceData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <span className="text-base font-medium text-neutral-900 dark:text-white">{row.link}</span>
                                      <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                                          <ExternalLink className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                      </button>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="text-base font-semibold text-neutral-900 dark:text-white">{row.clicks}</span>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="text-base text-neutral-900 dark:text-white">892</span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <span className="text-base font-medium text-neutral-900 dark:text-white">71.5%</span>
                                      <span className={`text-xs flex items-center gap-0.5 ${row.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                          {row.trendUp ? <TrendingUp className="w-3 h-3" style={{strokeWidth: 1.5}} /> : <TrendingDown className="w-3 h-3" style={{strokeWidth: 1.5}} />}
                                          {row.trendUp ? '+' : '-'}{row.trend}%
                                      </span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="text-base text-neutral-900 dark:text-white">3m 24s</span>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="text-base font-medium text-neutral-900 dark:text-white">124</span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-1 h-8">
                                      <div className="w-1 h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                      <div className="w-1 h-4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
                                      <div className="w-1 h-5 bg-neutral-400 dark:bg-neutral-500 rounded"></div>
                                      <div className="w-1 h-6 bg-neutral-600 dark:bg-neutral-300 rounded"></div>
                                      <div className="w-1 h-8 bg-green-600 dark:bg-green-500 rounded"></div>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          <Pagination showingText="Hiển thị 3 trong 24 links" />
      </div>
    </div>
  );
};

export default Analytics;
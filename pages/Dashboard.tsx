import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Plus, 
  Link as LinkIcon, 
  MousePointerClick, 
  TrendingUp, 
  MapPin, 
  ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DateRangeFilter from '../components/DateRangeFilter';
import CreateLinkModal from '../components/CreateLinkModal';
import Modal from '../components/Modal';
import ShortLinkResult from '../components/ShortLinkResult';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0
  });
  const [topLinks, setTopLinks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Create Link State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState<any | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  
  // Date Filter State (Default to last 7 days)
  const [dateFilter, setDateFilter] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: '7 ngày' };
  });

  const handleRangeChange = (range: { start: Date; end: Date; label: string }) => {
    setDateFilter(range);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);

      const startDateIso = dateFilter.start.toISOString();
      const endDateIso = dateFilter.end.toISOString();

      try {
        // --- 1. Fetch Stats (Filtered by Date Range) ---
        
        // Stats 1: Links Created in this period
        const { count: linksCount } = await supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startDateIso)
          .lte('created_at', endDateIso);

        // Stats 2: Active Links created in this period
        const { count: activeLinksCount } = await supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gte('created_at', startDateIso)
          .lte('created_at', endDateIso);

        // Stats 3: Total Clicks in this period
        const { count: clicksCount } = await supabase
            .from('clicks')
            .select('id, links!inner(user_id)', { count: 'exact', head: true })
            .eq('links.user_id', user.id)
            .gte('created_at', startDateIso)
            .lte('created_at', endDateIso);

        setStats({
            totalLinks: linksCount || 0,
            totalClicks: clicksCount || 0, 
            activeLinks: activeLinksCount || 0
        });

        // --- 2. Fetch Top Recent Links (Global - or filtered? Let's keep this Global Recent for UX) ---
        const { data: recentLinks } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        setTopLinks(recentLinks || []);

        // --- 3. Fetch Chart Data (Dynamic Range) ---
        
        // Calculate number of days in range
        const diffTime = Math.abs(dateFilter.end.getTime() - dateFilter.start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // Initialize map for the selected range
        const dailyClicksMap = new Map<string, number>();
        const formattedChartData = [];

        // Loop from start date to end date
        for (let i = 0; i < diffDays; i++) {
            const d = new Date(dateFilter.start);
            d.setDate(d.getDate() + i);
            
            const dateKey = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // DD/MM format
            
            formattedChartData.push({
                dateKey: dateKey,
                name: dayLabel,
                clicks: 0
            });
            dailyClicksMap.set(dateKey, i);
        }

        // Query clicks history
        const { data: clicksHistory } = await supabase
            .from('clicks')
            .select('created_at, links!inner(user_id)')
            .eq('links.user_id', user.id)
            .gte('created_at', startDateIso)
            .lte('created_at', endDateIso);

        // Aggregate clicks
        if (clicksHistory) {
            clicksHistory.forEach(click => {
                const clickDate = new Date(click.created_at).toISOString().split('T')[0];
                const index = dailyClicksMap.get(clickDate);
                if (index !== undefined) {
                    formattedChartData[index].clicks += 1;
                }
            });
        }

        setChartData(formattedChartData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, dateFilter]);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader 
        title="Dashboard" 
        description={`Chào mừng trở lại${user?.user_metadata?.full_name ? ', ' + user.user_metadata.full_name : ''}!`}
      >
        <button className="border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white px-4 py-2.5 rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
          <Download className="w-5 h-5" strokeWidth={1.5} />
          Export
        </button>
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          Create Link
        </button>
      </PageHeader>

      {/* Date Range Selector */}
      <div className="mb-6">
        <DateRangeFilter onRangeChange={handleRangeChange} currentLabel={dateFilter.label} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          label="Links mới tạo" 
          value={loading ? '...' : stats.totalLinks} 
          icon={LinkIcon} 
          color="blue" 
          trendValue={stats.activeLinks > 0 ? `${stats.activeLinks} active` : undefined}
          trendLabel="trong kỳ"
        />
        <StatsCard 
          label="Lượt Click" 
          value={loading ? '...' : stats.totalClicks} 
          icon={MousePointerClick} 
          color="green" 
          trendValue="" // Could calculate trend vs previous period if needed
          trendLabel="trong kỳ"
        />
        <StatsCard 
          label="Tỉ lệ Click" 
          value={stats.totalLinks > 0 ? (stats.totalClicks / stats.totalLinks).toFixed(1) : "0"} 
          icon={TrendingUp} 
          color="purple" 
          trendValue=""
          trendLabel="click/link"
          trendDirection="neutral"
        />
        
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Top location</span>
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-md flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-2xl">🇻🇳</span>
             <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Việt Nam</span>
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-500">Unknown traffic</div>
        </div>
      </div>

      {/* Main Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Click Analytics Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Click Analytics</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Thống kê từ {dateFilter.start.toLocaleDateString('vi-VN')} đến {dateFilter.end.toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">Clicks</button>
            </div>
          </div>
          <div className="h-64 w-full">
            {loading ? (
                 <div className="h-full w-full flex items-center justify-center text-neutral-400">Đang tải dữ liệu...</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicksDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:opacity-20" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#737373', fontSize: 12}} 
                      minTickGap={30} // Prevent overlapping labels on custom ranges
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#171717', border: 'none', borderRadius: '6px', color: '#fff'}} 
                      itemStyle={{color: '#fff'}}
                      labelStyle={{color: '#a3a3a3', marginBottom: '0.25rem'}}
                    />
                    <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="currentColor" 
                    className="text-neutral-900 dark:text-white"
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                    />
                </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Links List */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Links gần đây</h3>
            <div className="space-y-4">
                {loading ? (
                     <div className="text-sm text-neutral-500">Đang tải...</div>
                ) : topLinks.length === 0 ? (
                    <div className="text-sm text-neutral-500">Chưa có link nào được tạo.</div>
                ) : (
                    topLinks.map((link, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{link.short_code}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{link.original_url}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{link.clicks}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">clicks</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button onClick={() => navigate('/links')} className="w-full mt-4 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors py-2 border-t border-neutral-200 dark:border-neutral-700">Xem tất cả</button>
        </div>
      </div>

      {/* Link Performance Table */}
      <div className="mb-8">
        <DataTable 
          title="Quản lý Link"
          data={topLinks}
          columns={[
            {
              header: 'Short Code',
              cell: (link) => (
                <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-neutral-900 dark:text-white">{link.short_code}</span>
                    <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>
              )
            },
            {
              header: 'Destination',
              cell: (link) => (
                <div className="max-w-xs">
                    <div className="truncate text-base text-neutral-900 dark:text-white">{link.original_url}</div>
                </div>
              )
            },
            {
              header: 'Clicks',
              accessorKey: 'clicks',
              cell: (link) => <span className="text-base font-medium text-neutral-900 dark:text-white">{link.clicks}</span>
            },
            {
              header: 'Created',
              cell: (link) => <span className="text-base text-neutral-600 dark:text-neutral-400">{new Date(link.created_at).toLocaleDateString()}</span>
            },
            {
              header: 'Status',
              cell: (link) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 text-gray-800'}`}>
                    {link.is_active ? 'Active' : 'Inactive'}
                </span>
              )
            }
          ]}
          enableSearch={false}
          enablePagination={false}
        />
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={(link) => {
            setIsCreateModalOpen(false);
            setCreatedLink(link);
            setIsResultModalOpen(true);
            // Optionally refresh stats here if needed, but might be overkill for just one link
        }} 
      />

      {/* Result Modal */}
      <Modal 
        isOpen={isResultModalOpen} 
        onClose={() => setIsResultModalOpen(false)} 
        title="Link Created Successfully"
      >
        {createdLink && (
            <ShortLinkResult 
                shortCode={createdLink.short_code} 
                originalUrl={createdLink.original_url} 
            />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Plus, 
  Link as LinkIcon, 
  MousePointerClick, 
  TrendingUp, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Tablet,
  ExternalLink,
  Globe,
  Search,
  Instagram,
  Twitter,
  BarChart,
  QrCode,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DateRangeFilter from '../components/DateRangeFilter';
import Pagination from '../components/Pagination';
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

  // Simplified data for the chart since we might not have granular history in the basic schema
  const data = [
    { name: 'Mon', clicks: 12 },
    { name: 'Tue', clicks: 19 },
    { name: 'Wed', clicks: 3 },
    { name: 'Thu', clicks: 5 },
    { name: 'Fri', clicks: 2 },
    { name: 'Sat', clicks: 3 },
    { name: 'Sun', clicks: 10 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // 1. Fetch basic counts from user_analytics view if available, or calculate
        // Since view creation might be async or restricted, let's try direct count first
        
        // Count links
        const { count: linksCount } = await supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Count active links
        const { count: activeLinksCount } = await supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true);

        // Sum clicks (This might be heavy on large DBs, but ok for starter)
        // Ideally use the `user_analytics` view provided in schema
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (analyticsData) {
             setStats({
                totalLinks: analyticsData.total_links || 0,
                totalClicks: analyticsData.total_clicks || 0,
                activeLinks: analyticsData.active_links || 0
             });
        } else {
             // Fallback if view not ready
             // Calculate clicks manually? Or just use 0
             setStats({
                totalLinks: linksCount || 0,
                totalClicks: 0, // Hard to sum without aggregation query
                activeLinks: activeLinksCount || 0
             });
        }

        // Fetch top 5 recent links
        const { data: recentLinks } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        setTopLinks(recentLinks || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back${user?.user_metadata?.full_name ? ', ' + user.user_metadata.full_name : ''}! Here is your links overview.`}
      >
        <button className="border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white px-4 py-2.5 rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
          <Download className="w-5 h-5" strokeWidth={1.5} />
          Export
        </button>
        <button 
            onClick={() => navigate('/links')}
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          Create Link
        </button>
      </PageHeader>

      {/* Date Range Selector */}
      <div className="mb-6">
        <DateRangeFilter />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          label="Total Links" 
          value={loading ? '...' : stats.totalLinks} 
          icon={LinkIcon} 
          color="blue" 
          trendValue={stats.activeLinks > 0 ? `${stats.activeLinks} active` : undefined}
          trendLabel="currently"
        />
        <StatsCard 
          label="Total Clicks" 
          value={loading ? '...' : stats.totalClicks} 
          icon={MousePointerClick} 
          color="green" 
          trendValue="+0%"
          trendLabel="vs last week"
        />
        <StatsCard 
          label="Click Rate" 
          value={stats.totalLinks > 0 ? (stats.totalClicks / stats.totalLinks).toFixed(1) : "0"} 
          icon={TrendingUp} 
          color="purple" 
          trendValue=""
          trendLabel="avg clicks/link"
          trendDirection="neutral"
        />
        
        {/* Custom Card for Location to match existing style */}
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
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Clicks over time (Mock Data)</p>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">Clicks</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#171717', border: 'none', borderRadius: '6px', color: '#fff'}} 
                  itemStyle={{color: '#fff'}}
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
          </div>
        </div>

        {/* Top Links List */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Links</h3>
            <div className="space-y-4">
                {topLinks.length === 0 ? (
                    <div className="text-sm text-neutral-500">No links created yet.</div>
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
            <button onClick={() => navigate('/links')} className="w-full mt-4 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors py-2 border-t border-neutral-200 dark:border-neutral-700">View All</button>
        </div>
      </div>

      {/* Link Performance Table */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-neutral-900 dark:text-white">Link Management</h2>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                    <input 
                      type="text" 
                      placeholder="Search links..." 
                      className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
                    />
                </div>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                        <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Short Code</th>
                        <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Destination</th>
                        <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Clicks</th>
                        <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Created</th>
                        <th className="text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-800">
                    {loading ? (
                        <tr><td colSpan={5} className="text-center py-8 text-neutral-500">Loading...</td></tr>
                    ) : topLinks.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No links found</td></tr>
                    ) : (
                        topLinks.map((link) => (
                            <tr key={link.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-medium text-neutral-900 dark:text-white">{link.short_code}</span>
                                        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                                            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="truncate text-base text-neutral-900 dark:text-white">{link.original_url}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-base font-medium text-neutral-900 dark:text-white">{link.clicks}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-base text-neutral-600 dark:text-neutral-400">{new Date(link.created_at).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 text-gray-800'}`}>
                                        {link.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

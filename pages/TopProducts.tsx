import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  BarChart2, 
  Link as LinkIcon, 
  QrCode, 
  Calendar, 
  Filter, 
  Package, 
  MousePointerClick, 
  Percent, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Share2,
  SortDesc
} from 'lucide-react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DateRangeFilter from '../components/DateRangeFilter';
import DataTable, { ColumnDef } from '../components/DataTable';

const TopProducts: React.FC = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [generatedLink, setGeneratedLink] = useState('');

  // Mock Data
  const products = [
    {
      id: 1,
      name: 'Sony WH-1000XM4 Wireless Headphones',
      category: 'Điện tử / Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
      platform: 'Lazada',
      platformCode: 'L',
      platformColor: 'orange',
      clicks: '3,421',
      clickTrend: '+18%',
      clickTrendUp: true,
      conversion: '12.4%',
      convTrend: '+2.1%',
      convTrendUp: true,
      revenue: '₫124.7M',
      commission: '₫8.7M',
      trend: [30, 40, 50, 60, 80]
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Điện tử / Smartphone',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop',
      platform: 'Tiki',
      platformCode: 'T',
      platformColor: 'blue',
      clicks: '2,892',
      clickTrend: '+25%',
      clickTrendUp: true,
      conversion: '8.9%',
      convTrend: '-1.2%',
      convTrendUp: false,
      revenue: '₫1.8B',
      commission: '₫162M',
      trend: [40, 50, 70, 80, 60]
    },
    {
      id: 3,
      name: 'Samsung Galaxy Watch 6',
      category: 'Điện tử / Smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop',
      platform: 'Lazada',
      platformCode: 'L',
      platformColor: 'orange',
      clicks: '1,876',
      clickTrend: '+12%',
      clickTrendUp: true,
      conversion: '15.3%',
      convTrend: '+3.4%',
      convTrendUp: true,
      revenue: '₫447.4M',
      commission: '₫35.8M',
      trend: [50, 60, 80, 70, 50]
    },
    {
      id: 4,
      name: 'Nike Air Max 270',
      category: 'Thời trang / Giày',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop',
      platform: 'Shopee',
      platformCode: 'S',
      platformColor: 'red',
      clicks: '1,654',
      clickTrend: '-5%',
      clickTrendUp: false,
      conversion: '18.7%',
      convTrend: '+4.2%',
      convTrendUp: true,
      revenue: '₫198.5M',
      commission: '₫15.9M',
      trend: [60, 50, 40, 30, 20]
    },
    {
      id: 5,
      name: 'Máy lọc không khí Xiaomi',
      category: 'Đồ gia dụng / Sức khỏe',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
      platform: 'Shopee',
      platformCode: 'S',
      platformColor: 'red',
      clicks: '1,432',
      clickTrend: '+8%',
      clickTrendUp: true,
      conversion: '22.1%',
      convTrend: '+6.7%',
      convTrendUp: true,
      revenue: '₫358M',
      commission: '₫28.6M',
      trend: [30, 40, 50, 60, 70]
    }
  ];

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleGenerateLink = (product: any) => {
    setSelectedProduct(product);
    setGeneratedLink('');
    setIsGenerateModalOpen(true);
  };

  const createLink = () => {
    const randomCode = Math.random().toString(36).substring(2, 8);
    setGeneratedLink(`ShortLink.vn/${randomCode}`);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader 
        title="Top Products" 
        description="Khám phá sản phẩm hot nhất để tối ưu affiliate marketing"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" style={{strokeWidth: 1.5}} />
          <input 
            type="text" 
            placeholder="Tìm sản phẩm..." 
            className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
          />
        </div>
        <button className="border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
          <Download className="w-4 h-4" style={{strokeWidth: 1.5}} />
          Export
        </button>
      </PageHeader>

      {/* Time Range & Category Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <DateRangeFilter />

          <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium">Tất cả</button>
                  <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 transition-colors text-neutral-900 dark:text-white">Shopee</button>
                  <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 transition-colors text-neutral-900 dark:text-white">Lazada</button>
                  <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 transition-colors text-neutral-900 dark:text-white">Tiki</button>
                  <button className="px-3 py-1.5 text-sm rounded-md hover:bg-white dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 transition-colors text-neutral-900 dark:text-white">Amazon</button>
              </div>
              <button className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <Filter className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  Bộ lọc
              </button>
              <button className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <SortDesc className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  Sắp xếp
              </button>
          </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
              label="Tổng Products" 
              value="2,847" 
              icon={Package} 
              color="blue" 
              trendValue="+156"
              trendLabel="vs tuần trước"
          />
          <StatsCard 
              label="Total Clicks" 
              value="45.2K" 
              icon={MousePointerClick} 
              color="green" 
              trendValue="+23.4%"
              trendLabel="vs tuần trước"
          />
          <StatsCard 
              label="Conversion Rate" 
              value="8.7%" 
              icon={Percent} 
              color="purple" 
              trendValue="+1.2%"
              trendLabel="vs tuần trước"
          />
          <StatsCard 
              label="Avg Commission" 
              value="₫89K" 
              icon={DollarSign} 
              color="orange" 
              trendValue="+12K"
              trendLabel="vs tuần trước"
          />
      </div>

      {/* Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Products Trend</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Xu hướng sản phẩm theo thời gian</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">Clicks</button>
                      <button className="px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">Revenue</button>
                      <button className="px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">Conversion</button>
                  </div>
              </div>

              {/* Visual Chart using Divs to match HTML */}
              <div className="space-y-4">
                  <div className="flex items-end gap-1 h-64 border-b border-neutral-200 dark:border-neutral-700 pb-4">
                      <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors relative" style={{height: '25%'}}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                                  <div className="font-medium">Tech</div>
                                  <div className="text-neutral-400 dark:text-neutral-500">2,341 clicks</div>
                              </div>
                          </div>
                          <div className="w-full bg-neutral-900 dark:bg-white rounded-t hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors" style={{height: '20%'}}></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-full bg-green-100 dark:bg-green-900/40 rounded-t hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors relative" style={{height: '65%'}}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                                  <div className="font-medium">Fashion</div>
                                  <div className="text-neutral-400 dark:text-neutral-500">6,123 clicks</div>
                              </div>
                          </div>
                          <div className="w-full bg-neutral-900 dark:bg-white rounded-t hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors" style={{height: '52%'}}></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-full bg-purple-100 dark:bg-purple-900/40 rounded-t hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors relative" style={{height: '45%'}}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                                  <div className="font-medium">Beauty</div>
                                  <div className="text-neutral-400 dark:text-neutral-500">4,234 clicks</div>
                              </div>
                          </div>
                          <div className="w-full bg-neutral-900 dark:bg-white rounded-t hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors" style={{height: '36%'}}></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-full bg-orange-100 dark:bg-orange-900/40 rounded-t hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors relative" style={{height: '85%'}}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                                  <div className="font-medium">Home</div>
                                  <div className="text-neutral-400 dark:text-neutral-500">8,012 clicks</div>
                              </div>
                          </div>
                          <div className="w-full bg-neutral-900 dark:bg-white rounded-t hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors" style={{height: '68%'}}></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-full bg-red-100 dark:bg-red-900/40 rounded-t hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors relative" style={{height: '95%'}}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                                  <div className="font-medium">Electronics</div>
                                  <div className="text-neutral-400 dark:text-neutral-500">8,945 clicks</div>
                              </div>
                          </div>
                          <div className="w-full bg-neutral-900 dark:bg-white rounded-t hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors" style={{height: '76%'}}></div>
                      </div>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/40 rounded"></div>
                          <span className="text-neutral-600 dark:text-neutral-400">Tech</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-100 dark:bg-green-900/40 rounded"></div>
                          <span className="text-neutral-600 dark:text-neutral-400">Fashion</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/40 rounded"></div>
                          <span className="text-neutral-600 dark:text-neutral-400">Beauty</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-100 dark:bg-orange-900/40 rounded"></div>
                          <span className="text-neutral-600 dark:text-neutral-400">Home</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-100 dark:bg-red-900/40 rounded"></div>
                          <span className="text-neutral-600 dark:text-neutral-400">Electronics</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Categories</h3>
                  <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Xem tất cả</button>
              </div>
              <div className="space-y-4">
                  {[
                      { name: 'Điện tử', clicks: '8,945', percent: 31.5, color: 'bg-red-600' },
                      { name: 'Đồ gia dụng', clicks: '8,012', percent: 28.2, color: 'bg-orange-600' },
                      { name: 'Thời trang', clicks: '6,123', percent: 21.6, color: 'bg-green-600' },
                      { name: 'Làm đẹp', clicks: '4,234', percent: 14.9, color: 'bg-purple-600' },
                      { name: 'Công nghệ', clicks: '2,341', percent: 3.8, color: 'bg-blue-600' },
                  ].map((cat, index) => (
                      <div key={index} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{cat.name}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">{cat.clicks} clicks</div>
                          </div>
                          <div className="text-right">
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">{cat.percent}%</div>
                              <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full mt-1">
                                  <div className={`h-full rounded-full ${cat.color}`} style={{width: `${cat.percent}%`}}></div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Products Table */}
      <div className="mb-8">
          <DataTable 
            title="Top Products"
            data={products}
            columns={[
              {
                header: 'Product',
                cell: (product) => (
                  <div className="flex items-center gap-3">
                      <img src={product.image} className="w-12 h-12 rounded-md object-cover" alt="Product" />
                      <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-neutral-900 dark:text-white truncate">{product.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{product.category}</div>
                      </div>
                  </div>
                )
              },
              {
                header: 'Platform',
                cell: (product) => (
                  <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          product.platformColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                          product.platformColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                          <span className="text-xs font-bold">{product.platformCode}</span>
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{product.platform}</span>
                  </div>
                )
              },
              {
                header: 'Clicks',
                accessorKey: 'clicks',
                cell: (product) => (
                  <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-neutral-900 dark:text-white">{product.clicks}</span>
                      <span className={`text-xs flex items-center gap-0.5 ${product.clickTrendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.clickTrendUp ? <TrendingUp className="w-3 h-3" style={{strokeWidth: 1.5}} /> : <TrendingDown className="w-3 h-3" style={{strokeWidth: 1.5}} />}
                          {product.clickTrend.replace(/[+-]/, '')}
                      </span>
                  </div>
                )
              },
              {
                header: 'Conversion',
                accessorKey: 'conversion',
                cell: (product) => (
                  <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-neutral-900 dark:text-white">{product.conversion}</span>
                      <span className={`text-xs flex items-center gap-0.5 ${product.convTrendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.convTrendUp ? <TrendingUp className="w-3 h-3" style={{strokeWidth: 1.5}} /> : <TrendingDown className="w-3 h-3" style={{strokeWidth: 1.5}} />}
                          {product.convTrend.replace(/[+-]/, '')}
                      </span>
                  </div>
                )
              },
              {
                header: 'Revenue',
                accessorKey: 'revenue',
                cell: (product) => <span className="text-base font-medium text-neutral-900 dark:text-white">{product.revenue}</span>
              },
              {
                header: 'Commission',
                accessorKey: 'commission',
                cell: (product) => <span className="text-base font-semibold text-neutral-900 dark:text-white">{product.commission}</span>
              },
              {
                header: 'Trend',
                cell: (product) => (
                  <div className="flex items-center gap-1 h-8">
                      {product.trend.map((h: number, i: number) => (
                          <div key={i} className={`w-1 rounded ${i === 4 ? 'bg-green-600 dark:bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`} style={{height: `${h}%`}}></div>
                      ))}
                  </div>
                )
              },
              {
                header: 'Actions',
                cell: (product) => (
                  <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleProductClick(product); }} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                          <BarChart2 className="w-4 h-4" style={{strokeWidth: 1.5}} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleGenerateLink(product); }} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                          <LinkIcon className="w-4 h-4" style={{strokeWidth: 1.5}} />
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                          <QrCode className="w-4 h-4" style={{strokeWidth: 1.5}} />
                      </button>
                  </div>
                )
              }
            ]}
            renderHeaderActions={() => (
              <button className="px-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-900 dark:text-white flex items-center gap-1">
                  <SortDesc className="w-3.5 h-3.5" style={{strokeWidth: 1.5}} />
                  Sắp xếp
              </button>
            )}
          />
      </div>

      {/* Product Detail Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Product Analytics" maxWidth="max-w-4xl">
          {selectedProduct && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Info */}
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                          <img src={selectedProduct.image} className="w-20 h-20 rounded-md object-cover" alt="Product" />
                          <div className="flex-1">
                              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{selectedProduct.name}</h4>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedProduct.category}</p>
                              <div className="flex items-center gap-2 mt-2">
                                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                                      selectedProduct.platformColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                      selectedProduct.platformColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                  }`}>
                                      <span className="text-xs font-bold">{selectedProduct.platformCode}</span>
                                  </div>
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{selectedProduct.platform}</span>
                              </div>
                          </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Clicks</div>
                              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{selectedProduct.clicks}</div>
                          </div>
                          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Conversion Rate</div>
                              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{selectedProduct.conversion}</div>
                          </div>
                          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Revenue</div>
                              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{selectedProduct.revenue}</div>
                          </div>
                          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Commission</div>
                              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{selectedProduct.commission}</div>
                          </div>
                      </div>

                      {/* Affiliate Actions */}
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                          <h5 className="font-medium text-neutral-900 dark:text-white mb-3">Affiliate Actions</h5>
                          <div className="flex flex-wrap gap-2">
                              <button onClick={() => { setIsProductModalOpen(false); handleGenerateLink(selectedProduct); }} className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium flex items-center gap-2">
                                  <LinkIcon className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                  Generate Link
                              </button>
                              <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
                                  <QrCode className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                  QR Code
                              </button>
                              <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
                                  <Share2 className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                  Share
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-4">
                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-white mb-3">Click Trend (7 days)</h5>
                          <div className="flex items-end gap-1 h-32">
                              {[40, 65, 55, 78, 95, 68, 85].map((h, i) => (
                                  <div key={i} className={`flex-1 rounded-t ${i === 6 ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'}`} style={{height: `${h}%`}}></div>
                              ))}
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                          </div>
                      </div>

                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-white mb-3">Device Distribution</h5>
                          <div className="space-y-3">
                              <div>
                                  <div className="flex justify-between text-sm mb-1 text-neutral-900 dark:text-white">
                                      <span>Mobile</span>
                                      <span className="font-medium">68%</span>
                                  </div>
                                  <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                                      <div className="h-full bg-blue-600 rounded-full" style={{width: '68%'}}></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between text-sm mb-1 text-neutral-900 dark:text-white">
                                      <span>Desktop</span>
                                      <span className="font-medium">24%</span>
                                  </div>
                                  <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                                      <div className="h-full bg-green-600 rounded-full" style={{width: '24%'}}></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between text-sm mb-1 text-neutral-900 dark:text-white">
                                      <span>Tablet</span>
                                      <span className="font-medium">8%</span>
                                  </div>
                                  <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                                      <div className="h-full bg-purple-600 rounded-full" style={{width: '8%'}}></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </Modal>

      {/* Generate Link Modal */}
      <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate Affiliate Link" maxWidth="max-w-md">
          {selectedProduct && (
              <>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Product</label>
                        <input type="text" value={selectedProduct.name} readOnly className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-base text-neutral-900 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Custom Slug (tùy chọn)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-base text-neutral-500 dark:text-neutral-400">ShortLink.vn/</span>
                            <input type="text" placeholder="custom-slug" className="flex-1 px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">UTM Parameters (tùy chọn)</label>
                        <div className="space-y-2">
                            <input type="text" placeholder="utm_source=" className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                            <input type="text" placeholder="utm_medium=" className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                            <input type="text" placeholder="utm_campaign=" className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                        </div>
                    </div>

                    {generatedLink && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">Link đã tạo:</div>
                                    <div className="text-sm text-green-700 dark:text-green-400 truncate">{generatedLink}</div>
                                </div>
                                <button onClick={() => { navigator.clipboard.writeText(generatedLink); alert('Copied!'); }} className="ml-3 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                                    <ArrowRight className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 mt-6 pt-4 flex items-center justify-end gap-3">
                    <button onClick={() => setIsGenerateModalOpen(false)} className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">
                        Hủy
                    </button>
                    <button onClick={createLink} className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">
                        Tạo Link
                    </button>
                </div>
              </>
          )}
      </Modal>
    </div>
  );
};

export default TopProducts;
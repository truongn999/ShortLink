import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Copy, 
  Link as LinkIcon, 
  Zap, 
  MousePointerClick, 
  Percent,
  Pause,
  Trash2,
  Play,
  ExternalLink,
  AlertTriangle,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Modal from '../components/Modal';
import CreateLinkModal from '../components/CreateLinkModal';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Links: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View & Filter State
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLinks = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setLinks(data);
    if (error) showToast('Không thể tải danh sách links', 'error');
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [user]);

  const openDeleteModal = (id: string) => {
    setLinkToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    const { error } = await supabase.from('links').delete().eq('id', linkToDelete);
    if (!error) {
        showToast('Đã xóa link thành công', 'success');
        fetchLinks();
        setIsDeleteModalOpen(false);
    } else {
        showToast('Xóa thất bại: ' + error.message, 'error');
    }
    setIsDeleting(false);
    setLinkToDelete(null);
  };

  const toggleActive = async (link: any) => {
      const { error } = await supabase
        .from('links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);
      
      if (!error) {
        fetchLinks();
        showToast(`Đã ${!link.is_active ? 'kích hoạt' : 'tạm dừng'} link`, 'success');
      } else {
        showToast('Cập nhật trạng thái thất bại', 'error');
      }
  }

  const handleCopy = (shortCode: string) => {
      const url = `${window.location.host}/${shortCode}`;
      navigator.clipboard.writeText(url);
      showToast('Đã sao chép link vào clipboard!', 'success');
  }

  // Filter and Pagination Logic
  const filteredLinks = links.filter(link => {
      const query = searchQuery.toLowerCase();
      return (
          link.short_code?.toLowerCase().includes(query) ||
          link.original_url?.toLowerCase().includes(query) ||
          (link.title && link.title.toLowerCase().includes(query))
      );
  });

  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);
  const paginatedLinks = filteredLinks.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader
        title="Links Management"
        description="Quản lý và tối ưu hóa tất cả các liên kết tiếp thị của bạn"
      >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" style={{strokeWidth: 1.5}} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm links..." 
              className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
            />
          </div>
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 border border-neutral-200 dark:border-neutral-700">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                title="Dạng danh sách"
              >
                  <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                title="Dạng lưới"
              >
                  <LayoutGrid className="w-4 h-4" />
              </button>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" style={{strokeWidth: 1.5}} />
            <span className="hidden sm:inline">Tạo Link</span>
          </button>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
            label="Tổng Links" 
            value={links.length} 
            icon={LinkIcon} 
            color="blue" 
        />
        <StatsCard 
            label="Active Links" 
            value={links.filter(l => l.is_active).length} 
            icon={Zap} 
            color="green" 
        />
        <StatsCard 
            label="Tổng Clicks" 
            value={links.reduce((acc, curr) => acc + (curr.clicks || 0), 0)} 
            icon={MousePointerClick} 
            color="purple" 
        />
        <StatsCard 
            label="Avg Clicks" 
            value={links.length > 0 ? Math.round(links.reduce((acc, curr) => acc + (curr.clicks || 0), 0) / links.length) : 0} 
            icon={Percent} 
            color="orange" 
        />
      </div>

      {/* Links Grid/List */}
      <div className={`grid gap-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
        {loading ? (
             <div className="col-span-full text-center py-12 text-neutral-500">Đang tải danh sách links...</div>
        ) : paginatedLinks.length === 0 ? (
             <div className="col-span-full text-center py-12 text-neutral-500">
                 {searchQuery ? 'Không tìm thấy link nào phù hợp.' : 'Chưa có link nào. Hãy tạo link mới để bắt đầu!'}
             </div>
        ) : (
            paginatedLinks.map((link) => (
            <div key={link.id} className={`bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all hover:shadow-md flex flex-col ${!link.is_active ? 'opacity-75' : ''}`}>
                <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`}>
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                    {link.short_code}
                                    <a href={`${window.location.protocol}//${window.location.host}/${link.short_code}`} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(link.created_at).toLocaleDateString('vi-VN')}</div>
                            </div>
                    </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Đích đến</div>
                        <div className="text-sm text-neutral-900 dark:text-white truncate hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer" title={link.original_url}>
                            {link.original_url}
                        </div>
                    </div>
                    
                    {viewMode === 'list' && (
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                                {link.is_active ? 'Hoạt động' : 'Đã dừng'}
                            </span>
                        </div>
                    )}

                    <div className={`grid ${viewMode === 'list' ? 'grid-cols-2' : 'grid-cols-1'} gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-700`}>
                        <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Lượt Click</div>
                            <div className="text-lg font-semibold text-neutral-900 dark:text-white">{link.clicks}</div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             {viewMode === 'grid' && (
                                <span className={`w-2 h-2 rounded-full ${link.is_active ? 'bg-green-500' : 'bg-gray-400'}`} title={link.is_active ? 'Hoạt động' : 'Đã dừng'}></span>
                             )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => handleCopy(link.short_code)} className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors" title="Sao chép">
                                <Copy className="w-4 h-4" style={{strokeWidth: 1.5}} />
                            </button>
                            <button onClick={() => toggleActive(link)} className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors" title={link.is_active ? "Tạm dừng" : "Kích hoạt"}>
                                {link.is_active ? <Pause className="w-4 h-4" style={{strokeWidth: 1.5}} /> : <Play className="w-4 h-4" style={{strokeWidth: 1.5}} />}
                            </button>
                            <button onClick={() => openDeleteModal(link.id)} className="p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Xóa">
                                <Trash2 className="w-4 h-4" style={{strokeWidth: 1.5}} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Pagination Controls */}
      {filteredLinks.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-2 mb-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                  <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 px-2">
                  Trang {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                  <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
          </div>
      )}

      {/* Create Wizard Modal */}
      <CreateLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchLinks();
        }} 
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Xác nhận xóa link">
        <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">Hành động này không thể hoàn tác</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">Link sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể truy cập được nữa.</p>
                </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
                Bạn có chắc chắn muốn xóa link này không?
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium">
                    Hủy bỏ
                </button>
                <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-70">
                    {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default Links;
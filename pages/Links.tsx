import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Copy, 
  QrCode, 
  BarChart2, 
  Star, 
  Link as LinkIcon, 
  Zap, 
  MousePointerClick, 
  Percent,
  Edit,
  Pause,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Play
} from 'lucide-react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import Pagination from '../components/Pagination';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Links: React.FC = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  
  // Create Form State
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkSlug, setNewLinkSlug] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchLinks = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [user]);

  const createLink = async () => {
    if (!user || !newLinkUrl) return;
    setIsCreating(true);

    try {
        // Use RPC or just manual check for slug?
        // Schema says short_code is unique.
        let slug = newLinkSlug;
        if (!slug) {
            const { data: generatedSlug, error: rpcError } = await supabase.rpc('generate_unique_short_code');
            if (rpcError) throw rpcError;
            slug = generatedSlug;
        }

        const { error } = await supabase.from('links').insert({
            user_id: user.id,
            original_url: newLinkUrl,
            short_code: slug,
            title: newLinkTitle || null,
            is_active: true
        });

        if (error) {
            alert('Error creating link: ' + error.message);
        } else {
            setIsCreateModalOpen(false);
            setNewLinkUrl('');
            setNewLinkSlug('');
            setNewLinkTitle('');
            fetchLinks();
        }
    } catch (err: any) {
        alert('Error: ' + err.message);
    } finally {
        setIsCreating(false);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) fetchLinks();
  };

  const toggleActive = async (link: any) => {
      const { error } = await supabase
        .from('links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);
      
      if (!error) fetchLinks();
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader
        title="Links Management"
        description="Manage and optimize all your affiliate links"
      >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" style={{strokeWidth: 1.5}} />
            <input 
              type="text" 
              placeholder="Search links..." 
              className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
            />
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" style={{strokeWidth: 1.5}} />
            Create Link
          </button>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
            label="Total Links" 
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
            label="Total Clicks" 
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

      {/* Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {loading ? (
             <div className="col-span-full text-center py-12 text-neutral-500">Loading links...</div>
        ) : links.length === 0 ? (
             <div className="col-span-full text-center py-12 text-neutral-500">No links found. Create one to get started!</div>
        ) : (
            links.map((link) => (
            <div key={link.id} className={`bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all hover:shadow-md ${!link.is_active ? 'opacity-75' : ''}`}>
                <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`}>
                                <LinkIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{link.short_code}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(link.created_at).toLocaleDateString()}</div>
                            </div>
                    </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Destination</div>
                        <div className="text-sm text-neutral-900 dark:text-white truncate hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer" title={link.original_url}>{link.original_url}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                            {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                        <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Clicks</div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white">{link.clicks}</div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Shared indicators placeholder */}
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/${link.short_code}`); alert('Link copied!')}} className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"><Copy className="w-4 h-4" style={{strokeWidth: 1.5}} /></button>
                            <button onClick={() => toggleActive(link)} className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                                {link.is_active ? <Pause className="w-4 h-4" style={{strokeWidth: 1.5}} /> : <Play className="w-4 h-4" style={{strokeWidth: 1.5}} />}
                            </button>
                            <button onClick={() => deleteLink(link.id)} className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" style={{strokeWidth: 1.5}} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Create Wizard Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Link" maxWidth="max-w-2xl">
         <div className="p-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Destination URL *</label>
                    <input 
                        type="url" 
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://example.com/your-affiliate-link" 
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Custom Slug (Optional)</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={newLinkSlug}
                            onChange={(e) => setNewLinkSlug(e.target.value)}
                            placeholder="your-custom-slug" 
                            className="flex-1 px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                        />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Leave blank to auto-generate</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Title (Optional)</label>
                    <input 
                        type="text" 
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Internal description" 
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">
                    Cancel
                </button>
                <button 
                    onClick={createLink} 
                    disabled={isCreating || !newLinkUrl}
                    className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Link'}
                </button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default Links;

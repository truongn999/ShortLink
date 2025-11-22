import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (link: any) => void;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkSlug, setNewLinkSlug] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createLink = async () => {
    if (!user || !newLinkUrl) return;
    setIsCreating(true);

    try {
        let slug = newLinkSlug;
        if (!slug) {
            const { data: generatedSlug, error: rpcError } = await supabase.rpc('generate_unique_short_code');
            if (rpcError) throw rpcError;
            slug = generatedSlug;
        }

        const { data, error } = await supabase.from('links').insert({
            user_id: user.id,
            original_url: newLinkUrl,
            short_code: slug,
            title: newLinkTitle || null,
            is_active: true
        }).select().single();

        if (error) {
            showToast('Lỗi tạo link: ' + error.message, 'error');
        } else {
            setNewLinkUrl('');
            setNewLinkSlug('');
            setNewLinkTitle('');
            showToast('Tạo link thành công!', 'success');
            onSuccess(data);
        }
    } catch (err: any) {
        showToast('Lỗi: ' + err.message, 'error');
    } finally {
        setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Link Mới" maxWidth="max-w-lg">
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">URL Đích (Destination) *</label>
                <input 
                    type="url" 
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://shopee.vn/san-pham..." 
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Đường dẫn tùy chỉnh (Optional)</label>
                <div className="flex items-center gap-2">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">{window.location.host}/</span>
                    <input 
                        type="text" 
                        value={newLinkSlug}
                        onChange={(e) => setNewLinkSlug(e.target.value)}
                        placeholder="khuyen-mai-tet" 
                        className="flex-1 px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                    />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Để trống để tạo ngẫu nhiên.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Tiêu đề (Optional)</label>
                <input 
                    type="text" 
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="Ví dụ: Chiến dịch Shopee T1" 
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" 
                />
            </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">
                Hủy bỏ
            </button>
            <button 
                onClick={createLink} 
                disabled={isCreating || !newLinkUrl}
                className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
                {isCreating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />}
                {isCreating ? 'Đang tạo...' : 'Tạo Link'}
            </button>
        </div>
    </Modal>
  );
};

export default CreateLinkModal;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PublicLayout from '@/components/layout/PublicLayout';
import type { Post } from '@/types';

export default function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const categories = ['Tất cả', 'Công nghệ', 'Thú vị mỗi ngày', 'Tin tức', 'Hướng dẫn'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      const postsWithReadTime = (data || []).map(post => ({
        ...post,
        read_time: Math.ceil((post.content?.length || 0) / 1000) + ' phút đọc'
      }));

      setPosts(postsWithReadTime);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Map Vietnamese categories to English if stored in English in DB, or assume DB has mixed/English categories.
    // For now, let's assume we filter based on the UI category matching the post category.
    // If 'Tất cả' is selected, show everything.
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory || (selectedCategory === 'All' && true); 
    // Note: If DB has English categories, we might need a mapping. 
    // Let's assume for now we might need to adjust this if categories don't match.
    // Ideally, we should translate the DB categories or map them.
    // Let's try to match loosely for now or just check if the post category includes the selected one if it's not 'Tất cả'.
    
    // Better approach: Just check if selectedCategory matches post.category. 
    // If the user selects 'Công nghệ' and DB has 'Technology', it won't match.
    // Let's stick to a simple check for now and maybe I should map the UI categories to potential DB values if I knew them.
    // Given V2 had: ['All', 'Technology', 'Daily Interesting', 'News', 'Tutorials']
    // I will map the Vietnamese selection back to English for filtering if needed, or just display Vietnamese if I can.
    
    let categoryToMatch = selectedCategory;
    if (selectedCategory === 'Công nghệ') categoryToMatch = 'Technology';
    if (selectedCategory === 'Thú vị mỗi ngày') categoryToMatch = 'Daily Interesting';
    if (selectedCategory === 'Tin tức') categoryToMatch = 'News';
    if (selectedCategory === 'Hướng dẫn') categoryToMatch = 'Tutorials';

    const matchesCategoryFinal = selectedCategory === 'Tất cả' || post.category === categoryToMatch || post.category === selectedCategory;

    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategoryFinal && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                Blog & Thông tin
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Cập nhật mới nhất, tin tức công nghệ và những khám phá thú vị mỗi ngày dành cho bạn.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent outline-none text-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md transform scale-105'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden h-[420px] animate-pulse">
                <div className="h-56 bg-neutral-200 dark:bg-neutral-700" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                  <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image_url || `https://source.unsplash.com/random/800x600?${post.category.split(' ')[0]}`} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider shadow-sm">
                    {post.category || 'Chung'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.read_time || '5 phút đọc'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {post.excerpt || 'Nhấn để đọc thêm về chủ đề thú vị này...'}
                  </p>

                  <div className="flex items-center text-neutral-900 dark:text-white font-semibold text-sm mt-auto group-hover:translate-x-2 transition-transform">
                    Đọc bài viết <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-neutral-100 dark:bg-neutral-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
              Chúng tôi không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('Tất cả');}}
              className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>


      {/* Pagination Controls */}
      {!loading && filteredPosts.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-2 pb-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      )}
    </PublicLayout>
  );
}

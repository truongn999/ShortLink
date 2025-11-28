import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, Tag, Filter, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
  author_id: string;
  read_time?: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();
  const { user, isAdmin } = useAuth(); // Check if user is logged in to show "Create Post"

  const categories = ['All', 'Technology', 'Daily Interesting', 'News', 'Tutorials'];

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
        read_time: Math.ceil((post.content?.length || 0) / 1000) + ' min read'
      }));

      setPosts(postsWithReadTime);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicLayout>
      <SEO 
        title="Blog & Insights" 
        description="Discover the latest technology news, daily interesting finds, and tutorials on ShortLink Blog."
      />
      
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                Blog & Insights
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Latest updates, technology news, and interesting daily discoveries curated just for you.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent outline-none text-sm" 
                />
              </div>

              {isAdmin && (
                 <Link 
                  to="/blog/new" 
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:opacity-90 transition-opacity text-sm whitespace-nowrap w-full sm:w-auto"
                >
                  Write Post <ArrowRight className="w-4 h-4" />
                </Link>
              )}
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
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image_url || `https://source.unsplash.com/random/800x600?${post.category.split(' ')[0]}`} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider shadow-sm">
                    {post.category || 'General'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.read_time || '5 min read'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {post.excerpt || 'Click to read more about this interesting topic...'}
                  </p>

                  <div className="flex items-center text-neutral-900 dark:text-white font-semibold text-sm mt-auto group-hover:translate-x-2 transition-transform">
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
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
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
              We couldn't find any posts matching your search criteria. Try adjusting your filters or search query.
            </p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Blog;

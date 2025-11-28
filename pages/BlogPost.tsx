import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Facebook, Linkedin, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import PublicLayout from '../components/PublicLayout';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import SEO from '../components/SEO';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
  author_id: string;
  read_time?: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (slug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      setPost({
        ...data,
        read_time: Math.ceil((data.content?.length || 0) / 1000) + ' min read'
      });
    } catch (error: any) {
      console.error('Error fetching post:', error);
      showToast('Post not found', 'error');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post?.id);

      if (error) throw error;

      showToast('Post deleted successfully', 'success');
      navigate('/blog');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      showToast('Error deleting post: ' + error.message, 'error');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-8" />
          <div className="h-12 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
          <div className="h-96 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-8" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!post) return null;

  return (
    <PublicLayout>
      <SEO 
        title={post.title} 
        description={post.excerpt || post.content.substring(0, 150)}
        image={post.image_url}
        type="article"
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <header className="mb-10 text-center relative">
          {isAdmin && (
            <div className="absolute top-0 right-0 flex gap-2">
              <button
                onClick={() => navigate(`/blog/edit/${post.slug}`)}
                className="p-2 text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
                title="Edit Post"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="inline-block px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full text-xs font-bold tracking-wide uppercase mb-6">
            {post.category || 'General'}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 border-y border-neutral-100 dark:border-neutral-800 py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-neutral-900 dark:text-white">Admin</span>
            </div>
            <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.read_time}
            </div>
          </div>
        </header>

        <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src={post.image_url || `https://source.unsplash.com/random/1200x800?${post.category}`} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ql-snow">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl">
            <div className="text-neutral-900 dark:text-white font-bold text-lg">
              Share this article
            </div>
            <div className="flex gap-4">
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm hover:shadow-md transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-700 dark:hover:text-blue-500 shadow-sm hover:shadow-md transition-all">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-500 shadow-sm hover:shadow-md transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-sm hover:shadow-md transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};

export default BlogPost;

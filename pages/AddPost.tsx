import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';
import { Save, Image as ImageIcon, X, Loader2, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    image_url: '',
    is_published: true
  });

  const categories = ['Technology', 'Daily Interesting', 'News', 'Tutorials'];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD') // Decompose combined characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens

    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      showToast('Image uploaded successfully', 'success');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showToast('Error uploading image: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const { slug: urlSlug } = useParams<{ slug: string }>();
  const isEditing = !!urlSlug;

  useEffect(() => {
    if (urlSlug) {
      fetchPost(urlSlug);
    }
  }, [urlSlug]);

  const fetchPost = async (slug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          category: data.category,
          image_url: data.image_url || '',
          is_published: data.is_published
        });
      }
    } catch (error: any) {
      console.error('Error fetching post:', error);
      showToast('Error fetching post details', 'error');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.slug || !formData.content) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url,
            category: formData.category,
            is_published: formData.is_published,
            // author_id: user.id // Don't update author
          })
          .eq('slug', urlSlug);

        if (error) throw error;
        showToast('Post updated successfully!', 'success');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url,
            category: formData.category,
            is_published: formData.is_published,
            author_id: user.id
          });

        if (error) throw error;
        showToast('Post created successfully!', 'success');
      }
      
      navigate('/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      showToast('Error saving post: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </button>

      <PageHeader 
        title={isEditing ? "Edit Post" : "Create New Post"}
        description={isEditing ? "Update your blog post content." : "Share your thoughts, news, or tutorials with the world."}
      />

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
        
        {/* Title & Slug */}
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-900 dark:text-white">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter post title"
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-900 dark:text-white">Slug <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
              required
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-900 dark:text-white">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
              className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-neutral-900 dark:text-white cursor-pointer">
              Publish immediately
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900 dark:text-white">Cover Image</label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <span className="text-sm text-neutral-500">OR</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  Upload
                </button>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Recommended size: 1200x630px. Max size: 5MB.
              </p>
            </div>
            {formData.image_url && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, image_url: ''})}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900 dark:text-white">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            placeholder="Brief summary of the post (optional)"
            rows={3}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900 dark:text-white">Content <span className="text-red-500">*</span></label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-6 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddPost;

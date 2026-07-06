'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '@/services/api';
import { AdminBlogPost } from '../../admin-types';
import { useAdminSession } from '../../useAdminSession';
import { toast } from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function BlogEditorPage() {
  const { ready, user } = useAdminSession();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';
  const blogId = isNew ? null : (params.id as string);
  const editorRef = useRef<any>(null);

  const [formData, setFormData] = useState<Partial<AdminBlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    seoTitle: '',
    seoDescription: '',
    author: user?.name || 'Sound Buttons Max Team',
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [ogImage, setOgImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch existing blog if not new
  const { data: blog, isLoading } = useQuery({
    queryKey: ['admin-blog', blogId],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/blogs/${blogId}`);
      return res.data as AdminBlogPost;
    },
    enabled: ready && !isNew,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        author: blog.author || '',
      });
    }
  }, [blog]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug === generateSlug(prev.title || '') ? generateSlug(newTitle) : prev.slug
    }));
  };

  const handleEditorChange = (content: string, editor: any) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());

        const res = await api.post('/blogs/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              progress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          },
        });

        const data = res.data;
        if (!data || !data.location) {
          reject('Invalid JSON response from server.');
          return;
        }

        const imgUrl = API_URL.replace('/api/v1', '') + data.location;
        resolve(imgUrl);
      } catch (err: any) {
        reject('Image upload failed: ' + err.message);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Title, Slug, and Content are required.');
      return;
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof AdminBlogPost]) {
          submitData.append(key, formData[key as keyof AdminBlogPost] as string);
        }
      });

      if (featuredImage) submitData.append('featuredImage', featuredImage);
      if (ogImage) submitData.append('ogImage', ogImage);

      if (isNew) {
        await api.post('/blogs', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Blog created successfully');
      } else {
        await api.put(`/blogs/${blogId}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Blog updated successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      router.push('/admin/blogs');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (!ready || (isLoading && !isNew)) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/blogs')}
          className="flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Blog'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Content *
                </label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <Editor
                    licenseKey="gpl"
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      images_upload_handler: handleImageUpload,
                      automatic_uploads: true,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">SEO Details</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                  placeholder="Leave empty to use original title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[100px] outline-none"
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="blog-post-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[100px] outline-none"
                  placeholder="Short summary of the blog"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Media</h3>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Featured Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setFeaturedImage(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  </div>
                  {(featuredImage || blog?.featuredImage) && (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                      <img 
                        src={featuredImage ? URL.createObjectURL(featuredImage) : (API_URL.replace('/api/v1', '') + blog?.featuredImage)} 
                        alt="Featured preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 mt-2">OG Image (Social Media)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setOgImage(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  </div>
                  {(ogImage || blog?.ogImage) && (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                      <img 
                        src={ogImage ? URL.createObjectURL(ogImage) : (API_URL.replace('/api/v1', '') + blog?.ogImage)} 
                        alt="OG preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

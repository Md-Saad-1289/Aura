import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  X,
  ExternalLink,
  Tag,
  FileText,
  Image as ImageIcon,
  User as UserIcon,
  ShoppingBag,
  Sliders,
  Check,
  RotateCcw,
  Layers
} from 'lucide-react';
import { BlogPost, Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { RichEditorialEditor } from './RichEditorialEditor';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
];

const PRESET_CATEGORIES = [
  'Materials & Metallurgy',
  'Craft & Provenance',
  'Design Philosophy',
  'Care Guide',
  'Atelier Journal',
  'Horological Archive',
];

export const BlogManagement: React.FC = () => {
  const { blogs, products, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'edit' | 'preview'>('edit');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string;
    readTime: string;
    status: 'published' | 'draft' | 'archived';
    featured: boolean;
    authorName: string;
    authorRole: string;
    authorAvatar: string;
    relatedProductIds: string[];
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: PRESET_COVERS[0],
    category: 'Craft & Provenance',
    tags: 'Craftsmanship, Design, Atelier',
    readTime: '5 min read',
    status: 'published',
    featured: false,
    authorName: currentUser?.name || 'Elena Rostova',
    authorRole: 'Principal Architect',
    authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    relatedProductIds: [],
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === 'published').length;
    const drafts = blogs.filter((b) => b.status === 'draft').length;
    const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const totalLikes = blogs.reduce((acc, b) => acc + (b.likes || 0), 0);
    const totalComments = blogs.reduce((acc, b) => acc + (b.comments?.length || 0), 0);
    return { total, published, drafts, totalViews, totalLikes, totalComments };
  }, [blogs]);

  // Categories list
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  // Filtered list
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || b.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || b.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchQuery, statusFilter, categoryFilter]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: `## The Architecture of Purpose

Begin your essay here. Detail the origins of materials, precision methods, or philosophical foundations.

> "A quote that captures the essence of this craft or discovery."

### Subheading on Provenance
Explain the detailed engineering or historical context.`,
      coverImage: PRESET_COVERS[0],
      category: 'Craft & Provenance',
      tags: 'Craftsmanship, Materiality, Atelier',
      readTime: '5 min read',
      status: 'published',
      featured: false,
      authorName: currentUser?.name || 'Elena Rostova',
      authorRole: currentUser?.role ? `${currentUser.role.toUpperCase()} Editor` : 'Principal Curator',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      relatedProductIds: products.slice(0, 2).map((p) => p.id),
    });
    setActiveEditorTab('edit');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      tags: post.tags.join(', '),
      readTime: post.readTime,
      status: post.status,
      featured: !!post.featured,
      authorName: post.author.name,
      authorRole: post.author.role,
      authorAvatar: post.author.avatar,
      relatedProductIds: post.relatedProductIds || [],
    });
    setActiveEditorTab('edit');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? generateSlug(val) : prev.slug,
    }));
  };

  const handleContentChange = (val: string) => {
    // Estimate read time: ~200 words per minute
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    setFormData((prev) => ({
      ...prev,
      content: val,
      readTime: `${minutes} min read`,
    }));
  };

  const toggleRelatedProduct = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.relatedProductIds.includes(productId);
      return {
        ...prev,
        relatedProductIds: exists
          ? prev.relatedProductIds.filter((id) => id !== productId)
          : [...prev.relatedProductIds, productId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postPayload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      coverImage: formData.coverImage.trim() || PRESET_COVERS[0],
      category: formData.category.trim() || 'General',
      tags: parsedTags.length > 0 ? parsedTags : ['Atelier'],
      readTime: formData.readTime || '5 min read',
      status: formData.status,
      featured: formData.featured,
      author: {
        name: formData.authorName.trim() || 'Curator',
        role: formData.authorRole.trim() || 'Atelier Contributor',
        avatar: formData.authorAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      },
      relatedProductIds: formData.relatedProductIds,
    };

    if (editingPost) {
      updateBlogPost(editingPost.id, postPayload);
    } else {
      addBlogPost(postPayload);
    }

    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleToggleStatus = (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    updateBlogPost(post.id, { status: nextStatus });
  };

  const handleDelete = (id: string) => {
    deleteBlogPost(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <span>Editorial & Journal Management</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Author essays, craft provenance stories, manage reader comments, and link catalog artifacts.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Stories</p>
          <p className="text-2xl font-bold font-serif text-zinc-950 mt-1">{metrics.total}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Published</p>
          <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">{metrics.published}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Drafts</p>
          <p className="text-2xl font-bold font-serif text-amber-700 mt-1">{metrics.drafts}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Reader Impressions</p>
          <p className="text-2xl font-bold font-serif text-zinc-950 mt-1">
            {metrics.totalViews.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">Total Dialogue</p>
          <p className="text-2xl font-bold font-serif text-zinc-950 mt-1">
            {metrics.totalComments} <span className="text-xs font-normal text-zinc-400 font-sans">({metrics.totalLikes} likes)</span>
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {(['all', 'published', 'draft', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  statusFilter === tab
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              {existingCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & authors..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Story & Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-400">
                    No articles found. Click <strong>"Write New Story"</strong> to publish an essay.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-950 truncate">{post.title}</p>
                          <p className="text-[11px] text-zinc-400 font-mono truncate">
                            /{post.slug}
                          </p>
                          {post.featured && (
                            <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5">
                              Lead Story
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900">{post.author.name}</p>
                          <p className="text-[10px] text-zinc-400">{post.author.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-[11px] text-zinc-500 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-zinc-400" />
                          <span>{(post.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-rose-400" />
                          <span>{post.likes || 0}</span>
                          <span className="text-zinc-300">|</span>
                          <MessageSquare className="w-3 h-3 text-purple-400" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-zinc-500 whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : post.status === 'draft'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Edit Story"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === post.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-0.5 text-zinc-500 hover:text-zinc-800 text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Story"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor / Create Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-zinc-200 my-8 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 bg-zinc-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{editingPost ? 'Edit Journal Story' : 'Draft New Atelier Dispatch'}</span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Compose editorial essays with markdown formatting and linked product artifacts.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Art of Slow Metallurgy: Titanium Optics"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    placeholder="the-art-of-slow-metallurgy"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Category, Status, Lead Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    list="category-options"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <datalist id="category-options">
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Lead Feature</span>
                    <span className="text-[10px] text-zinc-500">Showcase on top of Journal</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Excerpt / Summary (Listing Preview) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 2-sentence summary that sparks reader curiosity in feed listings..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Cover Image URL & Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center justify-between">
                  <span>Cover Image URL *</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Click preset or paste custom URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-200 flex-shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: preset })}
                      className={`relative w-12 h-8 rounded-md overflow-hidden border flex-shrink-0 transition-transform ${
                        formData.coverImage === preset ? 'ring-2 ring-amber-500 scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rich Editorial & Monograph Studio Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>Story Content & Editorial Studio</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    Supports Markdown, Live Split Preview, Snippets & Product Artifacts
                  </span>
                </label>

                <RichEditorialEditor
                  value={formData.content}
                  onChange={(val) => handleContentChange(val)}
                  title={formData.title}
                  excerpt={formData.excerpt}
                  category={formData.category}
                  authorName={formData.authorName}
                  products={products}
                />
              </div>

              {/* Author Dossier & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Author Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Acoustics, Titanium, Craft"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900"
                  />
                </div>
              </div>

              {/* Featured Artifacts Linker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Link Store Artifacts Featured in this Essay</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {formData.relatedProductIds.length} selected
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-44 overflow-y-auto p-2 bg-zinc-50 border border-zinc-200 rounded-xl">
                  {products.map((p) => {
                    const isSelected = formData.relatedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleRelatedProduct(p.id)}
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <img src={p.images[0]} alt={p.name} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                        <span className="text-[11px] truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 ml-auto flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{editingPost ? 'Save Story Changes' : 'Publish Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

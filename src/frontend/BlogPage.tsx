import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  Heart,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Tag as TagIcon,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  CheckCircle2,
  Send
} from 'lucide-react';
import { BlogPost, StorefrontView } from '../types';
import { useStore } from '../context/StoreContext';

interface BlogPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string, blogSlug?: string) => void;
  onSelectArticle?: (slugOrId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectArticle }) => {
  const { blogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const publishedBlogs = useMemo(() => {
    return blogs.filter((b) => b.status === 'published');
  }, [blogs]);

  // Extract all unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedBlogs.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return ['All', ...Array.from(cats)];
  }, [publishedBlogs]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    publishedBlogs.forEach((b) => {
      b.tags?.forEach((t) => tags.add(t));
    });
    return Array.from(tags);
  }, [publishedBlogs]);

  // Filtered posts
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      const matchesTag =
        !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [publishedBlogs, searchQuery, selectedCategory, selectedTag]);

  // Featured Lead Story
  const featuredPost = useMemo(() => {
    return publishedBlogs.find((b) => b.featured) || publishedBlogs[0];
  }, [publishedBlogs]);

  const handleReadPost = (post: BlogPost) => {
    if (onSelectArticle) {
      onSelectArticle(post.slug || post.id);
    }
    onNavigate('blog-detail', undefined, undefined, post.slug || post.id);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-zinc-50/50 min-h-screen pb-24">
      {/* Header & Sub-banner */}
      <div className="bg-zinc-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-zinc-800/30 via-zinc-950 to-zinc-950 opacity-80" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Atelier Dispatch & Living Archive</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                The Journal & Stories
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Essays on precision engineering, slow craftsmanship, raw materials provenance, and modern reductive living.
              </p>
            </div>

            {/* Quick search */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search essays & archives..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Pills Bar */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-sm border border-zinc-200/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedTag(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat && !selectedTag
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedTag && (
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                Tag: <strong className="text-zinc-900 font-medium">#{selectedTag}</strong>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-xs text-rose-500 hover:underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Lead Featured Story (Hero Card) - Only show if on 'All' and no search/tag filter */}
        {selectedCategory === 'All' && !selectedTag && searchQuery === '' && featuredPost && (
          <section className="bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] overflow-hidden group cursor-pointer" onClick={() => handleReadPost(featuredPost)}>
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-amber-400 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Lead Dispatch
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <span>{featuredPost.category}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-zinc-500 normal-case font-normal flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2
                    onClick={() => handleReadPost(featuredPost)}
                    className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 hover:text-amber-800 transition-colors leading-tight cursor-pointer"
                  >
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredPost.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="text-[11px] bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-950">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-zinc-500">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReadPost(featuredPost)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-transform hover:scale-105"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-zinc-950">
              {selectedCategory === 'All' ? 'Latest Stories & Essays' : selectedCategory}
              <span className="ml-2 text-xs font-sans font-normal text-zinc-500">
                ({filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'})
              </span>
            </h3>

            {/* Quick tag suggestions */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
                <TagIcon className="w-3 h-3" /> Topics:
              </span>
              {allTags.slice(0, 5).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                    selectedTag === t
                      ? 'bg-zinc-950 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 font-serif">No stories found</h4>
              <p className="text-xs text-zinc-500">
                We couldn't find any articles matching your search or active filters. Try searching for different keywords or reset tags.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Card Cover Image */}
                  <div
                    onClick={() => handleReadPost(post)}
                    className="relative h-52 overflow-hidden cursor-pointer bg-zinc-100"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      {post.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-zinc-950/75 backdrop-blur-xs text-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {post.readTime}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <h3
                        onClick={() => handleReadPost(post)}
                        className="text-lg font-serif font-bold text-zinc-950 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2 cursor-pointer"
                      >
                        {post.title}
                      </h3>

                      <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer Author & Stats */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-zinc-900 leading-tight">{post.author.name}</p>
                          <p className="text-[10px] text-zinc-400">{post.author.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-mono">{post.likes || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-mono">{post.comments?.length || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Editorial Archive CTA */}
        <section className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Subscribe to the Atelier Gazette
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Receive seasonal essays, architectural product release notes, and private workshop invitations directly in your dispatch inbox.
            </p>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you. You have been added to the private subscriber registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-zinc-500 pt-1">
              Zero spam. Published once fortnightly. Unsubscribe anytime with one click.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
